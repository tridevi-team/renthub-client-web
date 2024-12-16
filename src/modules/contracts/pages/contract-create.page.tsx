import { authPath } from '@modules/auth/routes';
import { contractTemplateRepositories } from '@modules/contract-templates/api/contract-template.api';
import type {
  ContractTemplateIndexResponseSchema,
  ContractTemplateSchema,
} from '@modules/contract-templates/schemas/contract-template.schema';
import { contractRepositories } from '@modules/contracts/api/contract.api';
import { StepChooseContractTemplate } from '@modules/contracts/components/step-choose-contract-template';
import StepConfirm from '@modules/contracts/components/step-confirm';
import StepFillContract from '@modules/contracts/components/step-fill-contract';
import { contractPath } from '@modules/contracts/routes';
import { roomRepositories } from '@modules/rooms/apis/room.api';
import type {
  RoomDetailResponseSchema,
  RoomIndexResponseSchema,
  RoomSchema,
} from '@modules/rooms/schema/room.schema';
import { ContentLayout } from '@shared/components/layout/content-layout';
import { Button } from '@shared/components/ui/button';
import { useCallbackRef } from '@shared/hooks/use-callback-ref';
import { errorLocale } from '@shared/hooks/use-i18n/locales/vi/error.locale';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import type { AwaitToResult } from '@shared/types/date.type';
import { checkAuthUser, checkPermissionPage } from '@shared/utils/checker.util';
import { Col, Row, Space, Steps } from 'antd';
import to from 'await-to-js';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import {
  type LoaderFunction,
  redirect,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'sonner';
import { StepChooseRoom } from '../components/step-choose-room';

export const loader: LoaderFunction = () => {
  const authed = checkAuthUser();
  const hasPermission = checkPermissionPage({
    module: 'contract',
    action: 'create',
  });
  if (!authed) {
    toast.error(errorLocale.LOGIN_REQUIRED);
  }
  if (!hasPermission) {
    return redirect(authPath.notPermission);
  }

  return null;
};

export function Element() {
  const [t] = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [loading, setLoading] = useState(false);
  const [selectedContractTemplate, setSelectedContractTemplate] =
    useState<ContractTemplateSchema>();
  const [selectedRoom, setSelectedRoom] = useState<RoomSchema>();
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<RoomSchema>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [rooms, setRooms] = useState<RoomSchema[]>([]);
  const [contractTemplates, setContractTemplates] = useState<
    ContractTemplateSchema[]
  >([]);
  const [restContractInfo, setRestContractInfo] = useState<any>({});
  const setSelectedRoomRef = useCallbackRef(setSelectedRoom);
  const setSelectedContractTemplateRef = useCallbackRef(
    setSelectedContractTemplate,
  );

  const fetchRooms = async () => {
    const [err, resp]: AwaitToResult<RoomIndexResponseSchema> = await to(
      roomRepositories.all({
        searchParams: {
          page: -1,
          pageSize: -1,
          filters: [
            { field: 'rooms.status', operator: 'eq', value: 'AVAILABLE' },
          ],
          sorting: [{ field: 'rooms.name', direction: 'asc' }],
        },
        isSelect: false,
      }),
    );
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return setRooms([]);
    }
    setRooms(resp?.data?.results || []);
  };

  const fetchContractTemplates = async () => {
    const [err, resp]: AwaitToResult<ContractTemplateIndexResponseSchema> =
      await to(
        contractTemplateRepositories.index({
          searchParams: {
            page: -1,
            pageSize: -1,
            filters: [
              {
                field: 'contract_template.isActive',
                operator: 'eq',
                value: 1,
              },
            ],
          },
        }),
      );
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return setContractTemplates([]);
    }
    setContractTemplates(resp?.data?.results || []);
  };

  const fetchRoomDetails = async (roomId: string) => {
    if (!roomId) return;
    const [err, resp]: AwaitToResult<RoomDetailResponseSchema> = await to(
      roomRepositories.detail({ id: roomId }),
    );
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return setSelectedRoomDetails(undefined);
    }
    setSelectedRoomDetails(resp?.data);
  };

  const steps = useMemo(() => {
    return [
      {
        title: t('contract_c_step_1'),
        description: t('contract_c_step_1_description'),
      },
      {
        title: t('contract_c_step_2'),
        description: t('contract_c_step_2_description'),
      },
      {
        title: t('contract_c_step_3'),
        description: t('contract_c_step_3_description'),
      },
      {
        title: t('contract_c_step_4'),
        description: t('contract_c_step_4_description'),
      },
    ];
  }, [t]);

  const next = useCallbackRef(() => {
    setCurrentStep((prev) => prev + 1);
  });

  const prev = useCallbackRef(() => {
    setCurrentStep((prev) => prev - 1);
  });

  const ButtonGroup = () => {
    const isStepValid = () => {
      switch (currentStep) {
        case 0:
          return !!selectedRoom;
        case 1:
          return !!selectedContractTemplate;
        case 2:
          return true;
        case 3:
          return true;
        default:
          return false;
      }
    };
    if (currentStep === 2) return null; // Skip button group in step 3
    return (
      <Space direction="horizontal">
        {currentStep === 0 && (
          <Button variant="outline" onClick={() => navigate(contractPath.root)}>
            {t('bt_back')}
          </Button>
        )}
        {currentStep > 0 && <Button onClick={prev}>{t('bt_previous')}</Button>}
        {currentStep === steps.length - 1 && (
          <Button onClick={() => onSubmit(restContractInfo)} loading={loading}>
            {t('bt_finish')}
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button disabled={!isStepValid()} onClick={next}>
            {t('bt_next')}
          </Button>
        )}
      </Space>
    );
  };

  const StepContentRender = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepChooseRoom
            rooms={rooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoomRef}
          />
        );
      case 1:
        return (
          <StepChooseContractTemplate
            contractTemplates={contractTemplates}
            selectedContractTemplate={selectedContractTemplate}
            setSelectedContractTemplate={setSelectedContractTemplateRef}
          />
        );
      case 2:
        return (
          <StepFillContract
            roomDetail={selectedRoomDetails}
            selectedContractTemplate={selectedContractTemplate}
            setRestContractInfo={setRestContractInfo}
            nextStep={next}
            prevStep={prev}
          />
        );
      case 3:
        return (
          <StepConfirm
            selectedContractTemplate={selectedContractTemplate}
            selectedRoom={selectedRoom}
            restContractInfo={restContractInfo}
          />
        );
    }
  };

  const onSubmit = async (values: any) => {
    if (!selectedRoom) return toast.error(t('ms_select_room_first'));
    setLoading(true);
    const { landlord, renter, services } = values;
    const [err, _]: AwaitToResult<any> = await to(
      contractRepositories.create({
        roomId: selectedRoom?.id,
        data: {
          ...values,
          services: services.map((service: any) => ({
            ...service,
            startIndex: service?.startIndex || 0,
          })),
          landlord: {
            ...landlord,
            birthday: dayjs(landlord.birthday).format('YYYY-MM-DD'),
            dateOfIssue: dayjs(landlord.dateOfIssue).format('YYYY-MM-DD'),
          },
          renter: {
            ...renter,
            birthday: dayjs(renter.birthday).format('YYYY-MM-DD'),
            dateOfIssue: dayjs(renter.dateOfIssue).format('YYYY-MM-DD'),
          },
          contractId: selectedContractTemplate?.id,
          room: {
            ...selectedRoomDetails,
            services: [],
            equipment: [],
            area: selectedRoomDetails?.roomArea || 0,
          },
          depositDate: dayjs(values.depositDate).format('YYYY-MM-DD'),
          rentalStartDate: dayjs(values.rentalStartDate).format('YYYY-MM-DD'),
          rentalEndDate: dayjs(values.rentalEndDate).format('YYYY-MM-DD'),
        },
      }),
    );
    setLoading(false);
    if (err) {
      if ('code' in err) {
        toast.error(t(err.code));
      } else {
        toast.error(t('UNKNOWN_ERROR'));
      }
      return;
    }
    toast.success(t('ms_create_contract_success'));
    localStorage.removeItem('contract-fill-form');
    localStorage.removeItem('prefill-contract-form');
    navigate(`${contractPath.root}`);
    return _;
  };

  useEffect(() => {
    fetchRooms();
    fetchContractTemplates();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchRoomDetails(selectedRoom.id);
    }
  }, [selectedRoom]);

  return (
    <ContentLayout title={t('contract_create_title')} pathname={pathname}>
      <Row gutter={[24, 16]}>
        <Col span={24} className="!z-50 sticky top-0 bg-white py-6">
          <Steps progressDot current={currentStep} items={steps} />
        </Col>
        <Col span={24}>
          <StepContentRender />
        </Col>
        <Col span={24}>
          <ButtonGroup />
        </Col>
      </Row>
    </ContentLayout>
  );
}

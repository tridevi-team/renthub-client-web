import type { ContractTemplateSchema } from '@modules/contract-templates/schemas/contract-template.schema';
import { ContractContentModal } from '@modules/contracts/components/step-choose-contract-template';
import type { RoomSchema } from '@modules/rooms/schema/room.schema';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { formatCurrency } from '@shared/utils/helper.util';
import { Card, Col, Row } from 'antd';
import dayjs from 'dayjs';
import {
  FilePenLine,
  House,
  KeyRound,
  Tv,
  User2Icon,
  Wrench,
} from 'lucide-react';
import { useMemo } from 'react';

type StepConfirmProps = {
  selectedRoom?: RoomSchema;
  selectedContractTemplate?: ContractTemplateSchema;
  restContractInfo?: {
    depositAmount: number;
    depositStatus: string;
    depositDate: string;
    rentalStartDate: string;
    rentalEndDate: string;
    landlord: any;
    renter: any;
    services: any;
    equipment: any;
  };
};

const { Meta } = Card;

const CardInfo = ({
  icon,
  title,
  description,
  className,
}: {
  icon: React.ReactElement;
  title: string;
  description: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card hoverable>
      <Meta
        className={className}
        title={
          <div className="flex items-center">
            {icon}
            <span className="ml-2 font-bold">{title}</span>
          </div>
        }
        description={description}
      />
    </Card>
  );
};

const StepConfirm = ({
  selectedRoom,
  selectedContractTemplate,
  restContractInfo,
}: StepConfirmProps) => {
  const [t] = useI18n();

  const mesureMap = useMemo(
    () => ({
      people: t('service_type_people'),
      room: t('service_type_room'),
      water_consumption: t('service_type_index'),
      electricity_consumption: t('service_type_index'),
    }),
    [t],
  );

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <h3 className="text-center font-bold text-2xl uppercase">
          {t('contract_confirm')}
        </h3>
      </Col>
      <Col xs={20} md={8} offset={4}>
        <CardInfo
          icon={<House />}
          title={t('contract_selected_room')}
          description={(() => {
            const { name, maxRenters, price, roomArea } = selectedRoom ?? {};
            const info = [
              {
                title: 'Tên',
                value: name,
              },
              {
                title: t('room_price'),
                value: formatCurrency(price ?? 0),
              },
              {
                title: t('room_area'),
                value: `${roomArea} m2`,
              },
              {
                title: t('room_max_renter'),
                value:
                  maxRenters === -1 ? t('common_no') : `${maxRenters} người`,
              },
            ];
            return (
              <div>
                {info.map(({ title, value }) => (
                  <div key={title} className="line-clamp-1">
                    <span className="font-bold">{title}</span>: {value}
                  </div>
                ))}
              </div>
            );
          })()}
          className="min-h-36"
        />
      </Col>
      <Col xs={20} md={8}>
        <ContractContentModal
          content={selectedContractTemplate?.content ?? ''}
          contractTemplate={selectedContractTemplate as ContractTemplateSchema}
        >
          <CardInfo
            icon={<FilePenLine />}
            className="min-h-36"
            title={t('contract_selected_template')}
            description={(() => {
              const { name } = selectedContractTemplate ?? {};
              const {
                depositAmount,
                depositDate,
                rentalEndDate,
                rentalStartDate,
              } = restContractInfo ?? {};

              const info = [
                {
                  title: t('contract_t_name'),
                  value: name,
                },
                {
                  title: t('contract_deposit_amount'),
                  value: formatCurrency(depositAmount ?? 0),
                },
                {
                  title: t('contract_deposit_date'),
                  value: dayjs(depositDate).format('DD/MM/YYYY'),
                },
                {
                  title: t('contract_rental_start_date'),
                  value: dayjs(rentalStartDate).format('DD/MM/YYYY'),
                },
                {
                  title: t('contract_rental_end_date'),
                  value: dayjs(rentalEndDate).format('DD/MM/YYYY'),
                },
              ];
              return (
                <div>
                  {info.map(({ title, value }) => (
                    <div key={title} className="line-clamp-1">
                      <span className="font-bold">{title}</span>: {value}
                    </div>
                  ))}
                </div>
              );
            })()}
          />
        </ContractContentModal>
      </Col>
      <Col xs={20} md={8} offset={4}>
        <CardInfo
          icon={<KeyRound />}
          title={t('contract_t_landlord')}
          description={(() => {
            const {
              fullName,
              citizenId,
              phoneNumber,
              gender,
              email,
              address,
              birthday,
              dateOfIssue,
              placeOfIssue,
            } = restContractInfo?.landlord ?? {};
            const info = [
              { title: t('contract_t_ll_gender'), value: fullName },
              { title: t('contract_t_ll_citizen_id'), value: citizenId },
              { title: t('contract_t_ll_phone'), value: phoneNumber },
              {
                title: t('contract_t_ll_gender'),
                value: t(`user_${gender as 'male' | 'female'}`),
              },
              { title: t('contract_t_ll_email'), value: email },
              {
                title: t('contract_t_ll_address'),
                value: `${address?.street}, ${address?.ward}, ${address?.district}, ${address?.city} 
              `,
              },
              {
                title: t('contract_t_ll_birthday'),
                value: dayjs(birthday).format('DD/MM/YYYY'),
              },
              {
                title: t('contract_t_ll_citizen_id_date'),
                value: dayjs(dateOfIssue).format('DD/MM/YYYY'),
              },
              {
                title: t('contract_t_ll_citizen_id_place'),
                value: placeOfIssue,
              },
            ];
            return (
              <div>
                {info.map(({ title, value }) => (
                  <div key={title} className="line-clamp-1">
                    <span className="font-bold">{title}</span>: {value}
                  </div>
                ))}
              </div>
            );
          })()}
          className="min-h-32"
        />
      </Col>
      <Col xs={20} md={8}>
        <CardInfo
          icon={<User2Icon />}
          title={t('contract_renter_info')}
          description={(() => {
            const {
              fullName,
              citizenId,
              phoneNumber,
              gender,
              email,
              address,
              birthday,
              dateOfIssue,
              placeOfIssue,
            } = restContractInfo?.renter ?? {};
            const info = [
              { title: t('contract_t_ll_gender'), value: fullName },
              { title: t('contract_t_ll_citizen_id'), value: citizenId },
              { title: t('contract_t_ll_phone'), value: phoneNumber },
              {
                title: t('contract_t_ll_gender'),
                value: t(`user_${gender as 'male' | 'female'}`),
              },
              { title: t('contract_t_ll_email'), value: email },
              {
                title: t('contract_t_ll_address'),
                value: `${address?.street}, ${address?.ward}, ${address?.district}, ${address?.city} 
              `,
              },
              {
                title: t('contract_t_ll_birthday'),
                value: dayjs(birthday).format('DD/MM/YYYY'),
              },
              {
                title: t('contract_t_ll_citizen_id_date'),
                value: dayjs(dateOfIssue).format('DD/MM/YYYY'),
              },
              {
                title: t('contract_t_ll_citizen_id_place'),
                value: placeOfIssue,
              },
            ];
            return (
              <div>
                {info.map(({ title, value }) => (
                  <div key={title} className="line-clamp-1">
                    <span className="font-bold">{title}</span>: {value}
                  </div>
                ))}
              </div>
            );
          })()}
          className="min-h-32"
        />
      </Col>
      <Col xs={20} md={8} offset={4}>
        <CardInfo
          icon={<Wrench />}
          title={t('contract_service')}
          description={(() => {
            const services = restContractInfo?.services ?? [];
            return (
              <div>
                {services.map((service: any, index: number) => (
                  <div key={service.id} className="line-clamp-1">
                    <span className="font-bold">{index + 1}. </span>
                    <span>{service.name}</span>:{' '}
                    <span>{formatCurrency(service.unitPrice)}/</span>
                    <span>
                      {
                        mesureMap[
                          service.type?.toLocaleLowerCase() as keyof typeof mesureMap
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}
          className="min-h-36"
        />
      </Col>
      <Col xs={20} md={8}>
        <CardInfo
          icon={<Tv />}
          title={t('contract_equipment')}
          description={(() => {
            const equipment = restContractInfo?.equipment ?? [];
            return (
              <div>
                {equipment.map((equip: any, index: number) => (
                  <div key={equip.id} className="line-clamp-1">
                    <span className="font-bold">{index + 1}. </span>
                    <span>{equip.name}</span>
                  </div>
                ))}
              </div>
            );
          })()}
          className="min-h-36"
        />
      </Col>
    </Row>
  );
};

export default StepConfirm;

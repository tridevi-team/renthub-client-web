import type { z } from '@app/lib/vi-zod';
import { contractTemplateRepositories } from '@modules/contract-templates/api/contract-template.api';
import ContractEditor, {
  type ContractEditorRef,
} from '@modules/contract-templates/components/contract-editor';
import { contractTemplatePath } from '@modules/contract-templates/routes';
import type {
  contractTemplateCreateRequestSchema,
  contractTemplateUpdateRequestSchema,
} from '@modules/contract-templates/schemas/contract-template.schema';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { Button } from '@shared/components/ui/button';
import DatePicker from '@shared/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/ui/form';
import { Input } from '@shared/components/ui/input';
import {
  CONTRACT_TEMPLATE_STATUS,
  CONTRACT_TEMPLATE_STATUS_OPTIONS,
  GENDER_OPTIONS,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import dayjs from 'dayjs';
import { ChevronLeft, Save } from 'lucide-react';
import { useRef } from 'react';
import { Col, Row } from 'react-grid-system';
import type { UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';

type ContractTemplateFormProps = {
  form: UseFormReturn<
    z.infer<
      | typeof contractTemplateCreateRequestSchema
      | typeof contractTemplateUpdateRequestSchema
    >
  >;
  loading?: boolean;
  onSubmit: (values: any) => void;
  initialContent?: string;
  isEdit?: boolean;
};

export function ContractTemplateForm({
  form,
  loading,
  onSubmit,
  initialContent,
  isEdit = false,
}: ContractTemplateFormProps) {
  const [t] = useI18n();
  const navigate = useNavigate();
  const editorRef = useRef<ContractEditorRef>(null);

  const { data: keyReplaces } = useSWR('contracts/key-replace', () =>
    contractTemplateRepositories.getKeyReplaces(),
  );

  const onSumbitClick = async (values: any) => {
    const htmlContent = editorRef.current?.getHTMLContent();
    if (htmlContent) {
      values.content = htmlContent as string;
    }
    onSubmit({
      ...values,
      isActive: values.isActive === CONTRACT_TEMPLATE_STATUS.ACTIVE,
    });
  };

  if (!keyReplaces) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSumbitClick)}
        className="space-y-4 px-2"
      >
        <Row className="gap-y-3 px-48">
          <Col xs={12}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_name').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12}>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_isActive')}</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={CONTRACT_TEMPLATE_STATUS_OPTIONS}
                      value={
                        field.value
                          ? CONTRACT_TEMPLATE_STATUS_OPTIONS[0].value
                          : CONTRACT_TEMPLATE_STATUS_OPTIONS[1].value
                      }
                      onValueChange={field.onChange}
                      placeholder={t('common_ph_select', {
                        field: t('contract_t_isActive').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12}>
            <hr className="my-3" />
            <h3 className="text-bold text-lg uppercase">
              {t('contract_t_landlord')}
            </h3>
          </Col>

          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_name')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_name').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_gender')}</FormLabel>
                  <FormControl>
                    <AutoComplete
                      options={GENDER_OPTIONS}
                      value={
                        field.value
                          ? GENDER_OPTIONS[1].value
                          : GENDER_OPTIONS[0].value
                      }
                      onValueChange={field.onChange}
                      placeholder={t('common_ph_select', {
                        field: t('contract_t_isActive').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_city')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_city').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_district')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_district').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_ward')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_ward').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={6}>
            <FormField
              control={form.control}
              name="landlord.address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_street')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_street').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="landlord.phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_phone')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_phone').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="landlord.birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_birthday')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={new Date(dayjs(field.value).toDate())}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="landlord.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_email')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_email').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="landlord.citizenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t('contract_t_ll_citizen_id').toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="landlord.dateOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id_date')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={new Date(dayjs(field.value).toDate())}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormField
              control={form.control}
              name="landlord.placeOfIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('contract_t_ll_citizen_id_place')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder={t('common_ph_input', {
                        field: t(
                          'contract_t_ll_citizen_id_place',
                        ).toLowerCase(),
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
        </Row>
        <Row className="px-10">
          <Col xs={24}>
            <hr className="my-3" />
            <h3 className="mb-3 text-bold text-lg uppercase">
              {t('contract_t_template')}
            </h3>
            <ContractEditor
              keyReplaces={keyReplaces || []}
              ref={editorRef as React.MutableRefObject<ContractEditorRef>}
              isEdit={isEdit}
              initialContent={initialContent}
            />
          </Col>
          <Col xs={24}>
            <div className="mt-10 flex justify-center space-x-2">
              <Button
                type="button"
                loading={loading}
                variant="outline"
                className="min-w-24"
                onClick={() => {
                  navigate(`${contractTemplatePath.root}`);
                }}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t('bt_back')}
              </Button>
              <Button type="submit" className="min-w-24" loading={loading}>
                <Save className="mr-2 h-4 w-4" />
                {t('bt_save')}
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </Form>
  );
}

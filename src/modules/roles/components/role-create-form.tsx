import type { z } from '@app/lib/vi-zod';
import {
  PERMISSION_KEY,
  type PermissionKeyType,
} from '@modules/auth/schemas/auth.schema';
import { rolePath } from '@modules/roles/routes';
import type { roleCreateRequestSchema } from '@modules/roles/schema/role.schema';
import { Button } from '@shared/components/ui/button';
import { Checkbox } from '@shared/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/ui/form';
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { ChevronLeft, Save } from 'lucide-react';
import { Col, Row } from 'react-grid-system';
import type { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

type RoleCreateFormProps = {
  form: ReturnType<typeof useForm<z.infer<typeof roleCreateRequestSchema>>>;
  loading?: boolean;
  onSubmit: (values: z.infer<typeof roleCreateRequestSchema>) => void;
};

export function RoleCreateForm({
  form,
  loading,
  onSubmit,
}: RoleCreateFormProps) {
  const [t] = useI18n();
  const navigate = useNavigate();

  const handleRowToggle = (key: PermissionKeyType) => {
    const currentPermissions = form.getValues(`permissions.${key}`);
    const allTrue =
      currentPermissions &&
      Object.values(currentPermissions).every((value) => value);
    const newValue = !allTrue;

    form.setValue(`permissions.${key}.read`, newValue);
    form.setValue(`permissions.${key}.create`, newValue);
    form.setValue(`permissions.${key}.update`, newValue);
    form.setValue(`permissions.${key}.delete`, newValue);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-2">
        <Row className="space-y-4 px-36">
          <Col xs={24}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('role_name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('role_description')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24}>
            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <FormLabel>{t('role_decentralization')}</FormLabel>
                  <FormControl>
                    <table className="w-full table-auto border-collapse">
                      <thead className="bg-gray-100">
                        <tr className="h-12">
                          <th className="w-10 border px-2 py-1">
                            {t('role_index')}
                          </th>
                          <th className="w-48 border px-2 py-1">
                            {t('role_permission_name')}
                          </th>
                          <th className="w-24 border px-2 py-1">
                            {t('role_view')}
                          </th>
                          <th className="w-24 border px-2 py-1">
                            {t('role_create')}
                          </th>
                          <th className="w-24 border px-2 py-1">
                            {t('role_update')}
                          </th>
                          <th className="w-24 border px-2 py-1">
                            {t('role_delete')}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {PERMISSION_KEY.map((key, index) => (
                          <tr key={key} className="h-12">
                            <td className="border px-2 py-1 text-center font-medium">
                              {index + 1}
                            </td>
                            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                            <td
                              className="cursor-pointer border px-2 py-1 font-medium hover:bg-gray-50"
                              onClick={() => handleRowToggle(key)}
                            >
                              {t(`role_${key}` as const)}
                            </td>
                            <td className="border px-2 py-1 text-center">
                              <FormField
                                control={form.control}
                                name={`permissions.${key}.read`}
                                render={({ field }) => (
                                  <FormItem className="m-0 p-0">
                                    <FormControl>
                                      <Checkbox
                                        className="mx-auto"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </td>
                            <td className="border px-2 py-1 text-center">
                              <FormField
                                control={form.control}
                                name={`permissions.${key}.create`}
                                render={({ field }) => (
                                  <FormItem className="m-0 p-0">
                                    <FormControl>
                                      <Checkbox
                                        className="mx-auto"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </td>
                            <td className="border px-2 py-1 text-center">
                              <FormField
                                control={form.control}
                                name={`permissions.${key}.update`}
                                render={({ field }) => (
                                  <FormItem className="m-0 p-0">
                                    <FormControl>
                                      <Checkbox
                                        className="mx-auto"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </td>
                            <td className="border px-2 py-1 text-center">
                              <FormField
                                control={form.control}
                                name={`permissions.${key}.delete`}
                                render={({ field }) => (
                                  <FormItem className="m-0 p-0">
                                    <FormControl>
                                      <Checkbox
                                        className="mx-auto"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Col>
          <Col xs={24}>
            <div className="flex justify-center space-x-2">
              <Button
                type="button"
                loading={loading}
                variant="outline"
                className="min-w-24"
                onClick={() => {
                  navigate(`${rolePath.root}`);
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

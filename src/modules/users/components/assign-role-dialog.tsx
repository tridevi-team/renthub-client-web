import type { Option } from '@app/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleRepositories } from '@modules/roles/apis/role.api';
import { roleAssignRequestSchema } from '@modules/roles/schema/role.schema';
import { userRepositories } from '@modules/users/apis/user.api';
import { AutoComplete } from '@shared/components/selectbox/auto-complete-select';
import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/components/ui/form';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useUpdateEffect } from '@shared/hooks/use-update-effect.hook';
import to from 'await-to-js';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useForm } from 'react-hook-form';

type AssignRoleDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
};

const AssignRoleDialog = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AssignRoleDialogProps) => {
  const [t] = useI18n();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Option[]>([]);
  const form = useForm({
    resolver: zodResolver(roleAssignRequestSchema),
    reValidateMode: 'onChange',
  });

  const onSearchUser = async (value: string) => {
    if (!value) {
      return [];
    }
    const [err, resp] = await to(userRepositories.search(value));
    if (err) {
      return [];
    }

    return resp?.data?.map((user: { id: string; fullName: string }) => ({
      id: user.id,
      label: user.fullName,
      value: user.id,
    }));
  };

  const fetchRoleData = async () => {
    setLoading(true);
    const [err, resp] = await to(
      roleRepositories.index({
        searchParams: {
          pageSize: -1,
          page: -1,
        },
      }),
    );
    setLoading(false);
    if (err) {
      return [];
    }
    return setRoles(
      resp?.data?.results?.map((role: { id: string; name: string }) => ({
        label: role.name,
        value: role.id,
      })) || [],
    );
  };

  useEffect(() => {
    fetchRoleData();
  }, []);

  useUpdateEffect(() => {
    if (isOpen) fetchRoleData();
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        form.reset();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t('account_title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-2"
          >
            <Row>
              <Col xs={12}>
                <FormField
                  name="userId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('account_full_name')}</FormLabel>
                      <FormControl>
                        <AutoComplete
                          options={[]}
                          onSearch={onSearchUser}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          placeholder={t('common_ph_search', {
                            field: t('account_email').toLowerCase(),
                          })}
                          debounceTime={500}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
              <Col xs={12}>
                <FormField
                  name="roleId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('user_role')}</FormLabel>
                      <AutoComplete
                        disabled={loading}
                        value={field.value}
                        options={roles}
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        placeholder={t('common_ph_select', {
                          field: t('user_role').toLowerCase(),
                        })}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
            </Row>
            <DialogFooter>
              <Button type="submit" loading={isSubmitting}>
                {t('bt_save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRoleDialog;

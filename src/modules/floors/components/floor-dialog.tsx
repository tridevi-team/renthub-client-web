import { zodResolver } from '@hookform/resolvers/zod';
import {
  floorCreateRequestSchema,
  type FloorCreateRequestSchema,
  type FloorSchema,
  type FloorUpdateRequestSchema,
} from '@modules/floors/schema/floor.schema';
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
import { Input } from '@shared/components/ui/input';
import { Textarea } from '@shared/components/ui/textarea';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { useEffect } from 'react';
import { Col, Row } from 'react-grid-system';
import { useForm } from 'react-hook-form';

type FloorDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: FloorCreateRequestSchema) => void;
  onUpdate: (data: FloorSchema) => void;
  isSubmitting: boolean;
  initialData?: FloorUpdateRequestSchema;
};

export function FloorDialog({
  isOpen,
  onClose,
  onCreate,
  onUpdate,
  isSubmitting,
  initialData,
}: FloorDialogProps) {
  const [t] = useI18n();
  const form = useForm({
    resolver: zodResolver(floorCreateRequestSchema),
    reValidateMode: 'onChange',
    defaultValues: initialData || {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        name: initialData.name.replace(/^Tầng\s*/, ''),
      });
    }
  }, [initialData, form]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        form.reset({
          name: '',
          description: '',
        });
        onClose();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? t('floor_edit_title') : t('floor_create_title')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              initialData
                ? (data) =>
                    onUpdate({
                      ...initialData,
                      ...data,
                      id: '',
                      houseId: '',
                      createdBy: null,
                      createdAt: null,
                      updatedBy: null,
                      updatedAt: null,
                    })
                : onCreate,
            )}
            className="space-y-4 px-2"
          >
            <Row>
              <Col xs={12}>
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('floor_name')}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          prefixElement={t('floor_prefix_input')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('floor_description')}</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={field.value ?? ''} />
                      </FormControl>
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
}

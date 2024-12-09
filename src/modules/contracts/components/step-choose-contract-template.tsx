import type { ContractTemplateSchema } from '@modules/contract-templates/schemas/contract-template.schema';
import { ScrollableDiv } from '@shared/components/extensions/scrollable-div';
import { Button } from '@shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@shared/components/ui/dialog';
import {
  DOM_PURIFY_ALLOWED_ATTR,
  DOM_PURIFY_ALLOWED_TAGS,
} from '@shared/constants/general.constant';
import { useI18n } from '@shared/hooks/use-i18n/use-i18n.hook';
import { Card, Col, Row, Skeleton } from 'antd';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';

interface StepChooseContractTemplateProps {
  contractTemplates: ContractTemplateSchema[];
  selectedContractTemplate: ContractTemplateSchema | undefined;
  setSelectedContractTemplate: React.Dispatch<
    React.SetStateAction<ContractTemplateSchema | undefined>
  >;
}

export function StepChooseContractTemplate({
  contractTemplates,
  selectedContractTemplate,
  setSelectedContractTemplate,
}: StepChooseContractTemplateProps) {
  const [t] = useI18n();

  if (!contractTemplates) return <Skeleton active />;
  return (
    <>
      <Row gutter={[16, 16]}>
        {contractTemplates.map((contractTemplate) => (
          <Col xs={24} sm={12} md={6} key={contractTemplate.id}>
            <ContractContentModal
              content={contractTemplate.content}
              contractTemplate={contractTemplate}
              onSelect={(contractTemplate) =>
                setSelectedContractTemplate(contractTemplate)
              }
            >
              <Card
                hoverable
                className={`hover:border-2 hover:border-primary ${
                  selectedContractTemplate?.id === contractTemplate.id
                    ? 'border-2 border-primary'
                    : selectedContractTemplate
                      ? 'opacity-50'
                      : ''
                }`}
                style={{
                  pointerEvents: 'auto',
                  height: '100%',
                }}
              >
                <Card.Meta
                  title={contractTemplate.name}
                  description={
                    <div>
                      <div>
                        {t('contract_t_created_at')}:{' '}
                        {dayjs(contractTemplate.createdAt).isValid()
                          ? dayjs(contractTemplate.createdAt).format(
                              'DD/MM/YYYY',
                            )
                          : dayjs().format('DD/MM/YYYY')}
                      </div>
                      <div>
                        {t('contract_t_updated_at')}:{' '}
                        {dayjs(contractTemplate.updatedAt).isValid()
                          ? dayjs(contractTemplate.updatedAt).format(
                              'DD/MM/YYYY',
                            )
                          : dayjs().format('DD/MM/YYYY')}
                      </div>
                    </div>
                  }
                />
              </Card>
            </ContractContentModal>
          </Col>
        ))}
      </Row>
    </>
  );
}

export const ContractContentModal = ({
  content,
  contractTemplate,
  onSelect,
  children,
}: {
  content: string;
  contractTemplate: ContractTemplateSchema;
  onSelect?: (contractTemplate: ContractTemplateSchema) => void;
  children?: React.ReactNode;
}) => {
  const [t] = useI18n();
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: DOM_PURIFY_ALLOWED_TAGS,
    ALLOWED_ATTR: DOM_PURIFY_ALLOWED_ATTR,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('contract_t_content')}</DialogTitle>
        </DialogHeader>
        <ScrollableDiv className="max-h-[60vh] overflow-auto px-4 md:px-0">
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            className="prose dark:prose-invert max-w-none"
          />
        </ScrollableDiv>
        {onSelect && (
          <Button onClick={() => onSelect(contractTemplate)}>
            {t('contract_select_template')}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

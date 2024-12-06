import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ScrollableDiv } from '@shared/components/extensions/scrollable-div';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { env } from '@shared/constants/env.constant';
import { useResetState } from '@shared/hooks/use-reset-state.hook';
import {
  Alignment,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  Paragraph,
  Table,
  Undo,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { debounce } from 'lodash';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';

type ContractEditorProps = {
  keyReplaces: { key: string; label: string }[];
  initialContent?: string;
  isEdit?: boolean;
};

export type ContractEditorRef = {
  getHTMLContent: () => React.ReactNode;
};

const ContractEditor = forwardRef<ContractEditorRef, ContractEditorProps>(
  ({ isEdit, keyReplaces, initialContent }, ref) => {
    const [editor, setEditor] = useState<any>(null);

    useImperativeHandle(ref, () => ({
      getHTMLContent: () => {
        return editor?.getData();
      },
    }));

    const insertKey = (key: string) => {
      if (editor) {
        const content = `{{${key}}}`;
        const viewFragment = editor.data.processor.toView(content);
        const modelFragment = editor.data.toModel(viewFragment);
        editor.model.insertContent(modelFragment);
        editor.editing.view.focus();
      }
    };

    if (!keyReplaces) {
      return null;
    }

    const [keyReplaceFiltered, setKeyReplaceFiltered, resetKeyReplaces] =
      useResetState(keyReplaces);

    const onChangeFilterKeyReplaces = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const value = e.target.value;
      if (!value) {
        resetKeyReplaces();
        return;
      }
      setKeyReplaceFiltered(
        keyReplaces.filter((keyReplace) =>
          keyReplace.label.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    };

    const debounceOnChangeFilterKeyReplaces = useMemo(
      () =>
        debounce((e: React.ChangeEvent<HTMLInputElement>) => {
          onChangeFilterKeyReplaces(e);
        }, 300),
      [],
    );

    const configEditor = useMemo(() => {
      return {
        licenseKey: env.ckeditorLicenseKey,
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          '|',
          'link',
          'insertTable',
          'alignment',
          '|',
          'bulletedList',
          'numberedList',
          'indent',
          'outdent',
        ],
        plugins: [
          Bold,
          Essentials,
          Heading,
          Indent,
          IndentBlock,
          Italic,
          Link,
          List,
          Alignment,
          Paragraph,
          Table,
          Undo,
        ],
        initialData: initialContent || '',
      };
    }, [initialContent]);

    if (isEdit && !initialContent) {
      return null;
    }

    return (
      <Row className="gap-y-4">
        <Col xs={12}>
          <CKEditor
            editor={ClassicEditor}
            config={configEditor}
            onReady={(editor) => {
              setEditor(editor);
            }}
          />
        </Col>
        <Col xs={12} md={2}>
          <Input
            className="my-2 h-10"
            onChange={debounceOnChangeFilterKeyReplaces}
            placeholder="Tìm kiếm từ khóa"
          />
        </Col>
        <Col xs={12} md={10}>
          <ScrollableDiv className="flex space-x-2 overflow-x-auto">
            {(keyReplaceFiltered || [])?.map(({ key, label }) => (
              <Button
                variant="secondary"
                key={key}
                type="button"
                onClick={() => insertKey(key)}
                className="my-2 min-w-60"
              >
                {label}
              </Button>
            ))}
          </ScrollableDiv>
        </Col>
      </Row>
    );
  },
);

export default ContractEditor;

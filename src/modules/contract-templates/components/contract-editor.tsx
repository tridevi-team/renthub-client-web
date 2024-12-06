import { Plate } from '@udecode/plate-common/react';
import { debounce } from 'lodash';
import { forwardRef, useEffect, useImperativeHandle } from 'react';

import { SettingsProvider } from '@shared/components/editor/settings';
import { useCreateEditor } from '@shared/components/editor/use-create-editor';
import { ScrollableDiv } from '@shared/components/extensions/scrollable-div';
import { Editor, EditorContainer } from '@shared/components/plate-ui/editor';
import { Button } from '@shared/components/ui/button';
import { Input } from '@shared/components/ui/input';
import { useResetState } from '@shared/hooks/use-reset-state.hook';
import { useMemo } from 'react';
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
    const editor = useCreateEditor({
      value: [],
    });

    const debouncedOnChange = useMemo(
      () =>
        debounce(({ value }) => {
          localStorage.setItem('contract-editor-value', JSON.stringify(value));
        }, 300),
      [],
    );
    const getHTMLContent = () => {
      const html = editor.api.htmlReact.serialize({
        nodes: editor.children,
        stripDataAttributes: true,
        stripWhitespace: true,
        convertNewLinesToHtmlBr: true,
      });
      return html;
    };

    useImperativeHandle(ref, () => ({
      getHTMLContent,
    }));

    const insertKey = (key: string) => {
      if (editor) {
        editor.insertText(key);
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

    useEffect(() => {
      if (initialContent && isEdit) {
        const values = editor.api.html.deserialize({
          element: initialContent,
        }) as any;
        console.log('values:', values);
        editor.children = values;
      }
    }, [initialContent]);

    return (
      <Row className="gap-y-4">
        <Col xs={12}>
          <SettingsProvider>
            <Plate editor={editor} onChange={debouncedOnChange}>
              <EditorContainer>
                <Editor variant="fullWidth" />
              </EditorContainer>
            </Plate>
          </SettingsProvider>
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

import { withProps } from '@udecode/cn';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { CodeLinePlugin } from '@udecode/plate-code-block/react';
import {
  ParagraphPlugin,
  PlateLeaf,
  usePlateEditor,
} from '@udecode/plate-common/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';

import { editorPlugins } from '@shared/components/editor/plugins/editor-plugins';
import { FixedToolbarPlugin } from '@shared/components/editor/plugins/fixed-toolbar-plugin';
import { FloatingToolbarPlugin } from '@shared/components/editor/plugins/floating-toolbar-plugin';
import { CodeLineElement } from '@shared/components/plate-ui/code-line-element';
import { ColumnElement } from '@shared/components/plate-ui/column-element';
import { ColumnGroupElement } from '@shared/components/plate-ui/column-group-element';
import { DateElement } from '@shared/components/plate-ui/date-element';
import { HeadingElement } from '@shared/components/plate-ui/heading-element';
import { HighlightLeaf } from '@shared/components/plate-ui/highlight-leaf';
import { HrElement } from '@shared/components/plate-ui/hr-element';
import { ParagraphElement } from '@shared/components/plate-ui/paragraph-element';
import { withPlaceholders } from '@shared/components/plate-ui/placeholder';
import { SlashInputElement } from '@shared/components/plate-ui/slash-input-element';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@shared/components/plate-ui/table-cell-element';
import { TableElement } from '@shared/components/plate-ui/table-element';
import { TableRowElement } from '@shared/components/plate-ui/table-row-element';
import { TocElement } from '@shared/components/plate-ui/toc-element';
import { ToggleElement } from '@shared/components/plate-ui/toggle-element';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';

export const useCreateEditor = () => {
  return usePlateEditor({
    override: {
      components: withPlaceholders({
        [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
        [CodeLinePlugin.key]: CodeLineElement,
        [ColumnItemPlugin.key]: ColumnElement,
        [ColumnPlugin.key]: ColumnGroupElement,
        [DatePlugin.key]: DateElement,
        [SlashInputPlugin.key]: SlashInputElement,
        [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
        [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
        [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
        [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: 'h4' }),
        [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: 'h5' }),
        [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: 'h6' }),
        [HighlightPlugin.key]: HighlightLeaf,
        [HorizontalRulePlugin.key]: HrElement,
        [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
        [ParagraphPlugin.key]: ParagraphElement,
        [TableCellHeaderPlugin.key]: TableCellHeaderElement,
        [TableCellPlugin.key]: TableCellElement,
        [TablePlugin.key]: TableElement,
        [TableRowPlugin.key]: TableRowElement,
        [TocPlugin.key]: TocElement,
        [TogglePlugin.key]: ToggleElement,
        [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
      }),
    },
    plugins: [...editorPlugins, FixedToolbarPlugin, FloatingToolbarPlugin],
    value: [],
  });
};

import { CalloutPlugin } from '@udecode/plate-callout/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { DocxPlugin } from '@udecode/plate-docx';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
  FontSizePlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { HtmlReactPlugin } from '@udecode/plate-html/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import { TogglePlugin } from '@udecode/plate-toggle/react';

import { FixedToolbarPlugin } from '@shared/components/editor/plugins/fixed-toolbar-plugin';

import { autoformatPlugin } from '@shared/components/editor/plugins/autoformat-plugin';
import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { alignPlugin } from './align-plugin';
import { basicNodesPlugins } from './basic-nodes-plugins';
import { blockMenuPlugins } from './block-menu-plugins';
import { cursorOverlayPlugin } from './cursor-overlay-plugin';
import { deletePlugins } from './delete-plugins';
import { exitBreakPlugin } from './exit-break-plugin';
import { indentListPlugins } from './indent-list-plugins';
import { lineHeightPlugin } from './line-height-plugin';
import { resetBlockTypePlugin } from './reset-block-type-plugin';
import { softBreakPlugin } from './soft-break-plugin';
import { tablePlugin } from './table-plugin';
import { tocPlugin } from './toc-plugin';

export const viewPlugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  DatePlugin,
  tablePlugin,
  TogglePlugin,
  tocPlugin,
  CalloutPlugin,

  // Marks
  BasicMarksPlugin,
  FontColorPlugin,
  FontBackgroundColorPlugin,
  FontSizePlugin,
  HighlightPlugin,

  // Block Style
  alignPlugin,
  ...indentListPlugins,
  lineHeightPlugin,
] as const;

export const editorPlugins = [
  ...viewPlugins,
  autoformatPlugin,

  // Functionality
  SlashPlugin,
  cursorOverlayPlugin,
  ...blockMenuPlugins,
  exitBreakPlugin,
  resetBlockTypePlugin,
  ...deletePlugins,
  softBreakPlugin,

  // Deserialization
  HtmlReactPlugin,
  DocxPlugin,
  MarkdownPlugin.configure({ options: { indentList: true } }),
  JuicePlugin,

  // UI
  FixedToolbarPlugin,
];

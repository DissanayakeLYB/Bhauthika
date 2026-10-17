import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { colors, fonts } from '@/theme';

interface RichTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  boldStyle?: StyleProp<TextStyle>;
}

/** Renders a string with **double-asterisk** emphasis as bold inline runs. */
export function RichText({ text, style, boldStyle }: RichTextProps) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <Text style={style}>
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text
            key={`${index}-${part}`}
            style={[
              { fontFamily: fonts.bodyBold, color: colors.ink },
              boldStyle,
            ]}
          >
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        ),
      )}
    </Text>
  );
}

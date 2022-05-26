import React, { useEffect, useState } from "react";
import { Anchor } from "src/anchor";
import { Typography } from "antd";
const { Paragraph, Text } = Typography;

interface ExpandableTextProps {
  text: string;
  characterLimit: number;
}

export function ExpandableText({
  text,
  characterLimit,
}: ExpandableTextProps): React.ReactElement {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(false);
  }, [text]);

  if (text.length <= characterLimit) return <>{text}</>;

  return (
    <>
      <>
        <Paragraph ellipsis={!isExpanded}>{text}</Paragraph>{" "}
        {!isExpanded && (
          <Anchor onClick={() => setIsExpanded(true)}>Show More</Anchor>
        )}
        {isExpanded && (
          <Anchor onClick={() => setIsExpanded(false)}>Show Less</Anchor>
        )}
      </>
      {/*<>*/}
      {/*  {text} <Anchor onClick={() => setIsExpanded(false)}>Show Less</Anchor>*/}
      {/*</>*/}
    </>
  );
}

export default ExpandableText;

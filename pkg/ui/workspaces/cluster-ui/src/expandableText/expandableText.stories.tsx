import React from "react";
import { storiesOf } from "@storybook/react";

import { ExpandableText } from "./expandableText";

const text =
  "testing testingtesting testingtesting testingtesting testingtesting testingtesting testingtesting testingtesting testingtesting testingtesting testingtesting testing";

storiesOf("ExpandableText", module)
  .add("Text exceeds length", () => (
    <div style={{ width: "200px" }}>
      <ExpandableText text={text} characterLimit={5} />
    </div>
  ))
  .add("Text is within length", () => (
    <ExpandableText text={text} characterLimit={50} />
  ));

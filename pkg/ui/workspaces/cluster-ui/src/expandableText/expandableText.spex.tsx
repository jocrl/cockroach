import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ExpandableText from "./ExpandableText";

describe("ExpandableText", () => {
  const text = "testing testing";
  it("should expand and collapse", async () => {
    const { getByText } = render(
      <ExpandableText text={text} characterLimit={5} />,
    );

    const truncatedText = "testi...";
    getByText(truncatedText);
    await userEvent.click(getByText("Show More"));
    getByText(text);
    await userEvent.click(getByText("Show Less"));
    getByText(truncatedText);
  });
  it("should not collapse text that is within the character limit", () => {
    const { getByText, queryByText } = render(
      <ExpandableText text={text} characterLimit={50} />,
    );

    getByText(text);
    const showMore = queryByText("Show More");
    expect(showMore).toBeNull();
    const showLess = queryByText("Show Less");
    expect(showLess).toBeNull();
  });
});

import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import {
  succeededJobProps,
  hypotheticalFailedWithRetriableErrorsJobProps,
  finalErrorMessage,
  retriableErrorMessages,
} from "./jobDetails.fixture";

import React from "react";
import { JobDetails } from "oss/src/views/jobs/jobDetails";

describe.only("JobDetails", () => {
  it("renders a message when there are no retriable errors", () => {
    const { getByText } = render(
      <MemoryRouter>
        <JobDetails {...succeededJobProps} />
      </MemoryRouter>,
    );
    getByText("No previous job errors occurred.");
  });
  it("renders both the final error message and any retriable errors", () => {
    const { getByText } = render(
      <MemoryRouter>
        <JobDetails {...hypotheticalFailedWithRetriableErrorsJobProps} />
      </MemoryRouter>,
    );
    getByText(finalErrorMessage);
    for (const errorMessage of retriableErrorMessages) {
      // Just checking that it renders; truncated to max 100 chars because
      const truncatedMessage = errorMessage.substring(0, Math.min(length, 100));
      console.log(truncatedMessage);
      getByText(truncatedMessage);
    }
  });
});

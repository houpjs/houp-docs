---
sidebar_position: 1
sidebar_label: Use Namespaced Provider
title: Use Namespaced Provider
---

This tutorial will guide you on how to use the namespaced provider. We’ll create a simple survey with two steps. In the first step, you’ll select a gender. The second step will display content based on the gender selected in the first step. For simplicity, the second step will only show the selected gender.

## Setup

Add Houp in you project.

```tsx
npm install houp
```

## Add `<Provider />`

Add `<Provider />` at the top of your App.

```tsx title="src/index.tsx"
import { Provider } from "houp";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    // highlight-next-line
    <Provider />
    <App />
  </StrictMode>
);
```

## Register a global store

Create a hook in `src/useSurveyPanel.ts` and register it as a global store to manage the visibility of the survey panel.

```tsx title="src/useSurveyPanel.ts"
import { registerStore } from "houp";
import { useState } from "react";

export default function useSurveyPanel() {
  const [show, setShow] = useState(false);

  return {
    show,
    setShow,
  };
}

registerStore(useSurveyPanel);
```

## Register a store with a namespace

Create a hook in `src/useSurvey.ts` and register it under the `survey` namespace. This store will be used in the survey component.

```tsx title="src/useSurvey.ts"
import { registerStore } from "houp";
import { useState } from "react";

export type Survey = {
  step: "first" | "second";
  gender: "male" | "female";
};

export default function useSurvey() {
  const [survey, setSurvey] = useState<Survey>({
    step: "first",
    gender: "male",
  });

  return {
    survey,
    setSurvey,
  };
}

registerStore(useSurvey, "survey");
```

## Create the Survey component

Create the `Survey` component in `src/survey.tsx`, which contains two child components: `FirstStep` and `SecondStep`. The `FirstStep` component allows you to choose a gender, while the `SecondStep` displays the selected gender.

The `SecondStep` includes a 'Previous' button. When clicked, it returns you to the `FirstStep`, and the gender choice is preserved because it is saved in the `useSurvey` store.

Clicking the 'Done' button in the `SecondStep` component will close the survey.

```tsx title="src/survey.tsx"
import { useStore } from "houp";
import useSurvey from "./useSurvey";
import useSurveyPanel from "./useSurveyPanel";

function FirstStep() {
  const store = useStore(useSurvey);

  const setGender = (gender: "male" | "female") => {
    store.setSurvey((state) => ({ ...state, gender }));
  };

  return (
    <div>
      Choose your gender:
      <label style={{ display: "block" }}>
        <input
          type="radio"
          name="gender"
          value="male"
          // highlight-next-line
          defaultChecked={store.survey.gender === "male"}
          onChange={(e) => setGender(e.target.value as "male" | "female")}
        />
        Male
      </label>
      <label style={{ display: "block" }}>
        <input
          type="radio"
          name="gender"
          value="female"
          // highlight-next-line
          defaultChecked={store.survey.gender === "female"}
          onChange={(e) => setGender(e.target.value as "male" | "female")}
        />
        Female
      </label>
      <button
        onClick={() =>
          store.setSurvey((state) => ({ ...state, step: "second" }))
        }
      >
        Next
      </button>
    </div>
  );
}

function SecondStep() {
  const store = useStore(useSurvey, (state) => ({
    gender: state.survey.gender,
    setSurvey: state.setSurvey,
  }));
  // highlight-next-line
  const panelStore = useStore(useSurveyPanel);

  return (
    <>
      <div>Gender: {store.gender}</div>
      <button
        onClick={() =>
          store.setSurvey((state) => ({ ...state, step: "first" }))
        }
      >
        Previous
      </button>
      // highlight-next-line
      <button onClick={() => panelStore.setShow(false)}>Done</button>
    </>
  );
}

export default function Survey() {
  const store = useStore(useSurvey);

  return (
    <>
      <div>
        <span>----</span>
        <b
          style={{
            color: store.survey.step === "first" ? "green" : "gray",
          }}
        >
          Step 1
        </b>
        <span>-----------------------</span>
        <b
          style={{
            color: store.survey.step === "second" ? "green" : "gray",
          }}
        >
          Step 2
        </b>
        <span>----</span>
      </div>
      {store.survey.step === "first" && <FirstStep />}
      {store.survey.step === "second" && <SecondStep />}
    </>
  );
}

```

## Add the Survey component to the App

Clicking the 'Begin' button will display the survey, and the button will remain hidden until you click the 'Done' button in the survey.

```tsx title="src/App.tsx"
import { Provider, useStore } from "houp";
import Survey from "./survey";
import "./styles.css";
import useSurveyPanel from "./useSurveyPanel";

export default function App() {
  const store = useStore(useSurveyPanel);

  if (!store.show) {
    // highlight-next-line
    return <button onClick={() => store.setShow(true)}>Begin</button>;
  }
  return (
    <>
      {store.show && (
        <>
          <Provider namespace="survey" />
          <Survey />
        </>
      )}
    </>
  );
}
```

:::tip

Each time you complete the survey, the namespaced provider `<Provider namespace="survey" />` will be unmounted. When you click 'Begin' again, a new `useSurvey` store will be created.

:::

## Full Example

Here’s the complete survey application, running on CodeSandbox.

<iframe src="https://codesandbox.io/embed/78sxzm?codemirror=1&hidenavigation=1&module=%2Fsrc%2Fsurvey.tsx&runonclick=1"
     style={{width:"100%", height: 500, border:0, borderRadius: 4, overflow:"hidden",}}
     title="houp-namespaced-provider-sample"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
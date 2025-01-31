import {
  FileDown,
  FileText,
  PartyPopper,
  PencilRuler,
  PenLine,
  Rows4,
  Save,
  SquarePlus,
  TableProperties,
} from "lucide-react";
import { Tour } from "onborda/dist/types";

export const tourSteps: Tour[] = [
  // Example steps
  {
    tour: "mainTour",
    steps: [
      {
        icon: <>👋</>,
        title: "Welcome to HR Docx!",
        content: <>You can find documents by searching here...</>,
        selector: "#search-input",
        side: "bottom",
        showControls: true,
        pointerPadding: -75,
        pointerRadius: 10,
      },
      {
        icon: <FileText />,
        title: "Select a document.",
        content: (
          <>
            These are the list of documents you can simply click on any one
            document to proceed further.
          </>
        ),
        selector: "#docs-1",
        side: "right",
        showControls: true,
        pointerPadding: 20,
        pointerRadius: 10,
        nextRoute: "/documents/employee-handbook",
      },
      {
        icon: <PenLine />,
        title: "Fill in the document info.",
        content: (
          <>
            You can fill the form fields below which will auto fill the
            variables set in given document.
          </>
        ),
        selector: "#info-form",
        side: "right",
        showControls: true,
        pointerPadding: -10,
        pointerRadius: 10,
        prevRoute: "/",
      },
      {
        icon: <PencilRuler />,
        title: "Customize your document.",
        content: (
          <>
            If you want to add any additional information to the document,
            simply editor this document.
          </>
        ),
        selector: "#editor",
        side: "left",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <FileDown />,
        title: "Generate document",
        content: (
          <>
            You can click on this generate button to simple download the
            document in pdf format.
          </>
        ),
        selector: "#generate-btn",
        side: "right",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/",
      },
      {
        icon: <Rows4 />,
        title: "Your Templates",
        content: <>Click here to find list of all templates.</>,
        selector: "#my-templates-link",
        side: "bottom",
        showControls: true,
        pointerPadding: 20,
        pointerRadius: 10,
        prevRoute: "/documents/employee-handbook",
        nextRoute: "/documents/generate",
      },
      {
        icon: <TableProperties />,
        title: "Templates List",
        content: (
          <>Here you can see all templates created by you and our team.</>
        ),
        selector: "#templates-table",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <SquarePlus />,
        title: "Create Template",
        content: (
          <>
            If you want to create an template simply click on this button to
            create one.
          </>
        ),
        selector: "#create-template-link",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/documents/generate/new",
      },

      {
        icon: <PenLine />,
        title: "Fill Information",
        content: (
          <>
            You can fill information and create auto-complete variables for your
            template.
          </>
        ),
        selector: "#info-form",
        side: "right",
        showControls: true,
        pointerPadding: -10,
        pointerRadius: 10,
        prevRoute: "/documents/generate",
      },
      {
        icon: <PencilRuler />,
        title: "Customize your steps",
        content: (
          <>
            Simple copy paste or write some text in to this rich text editor.
            Also you can use "#" to add variable into the editor.
          </>
        ),
        selector: "#editor",
        side: "left",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
      },
      {
        icon: <Save />,
        title: "Save the template.",
        content: (
          <>
            Once you finish drafting the template click on this button to save
            your template
          </>
        ),
        selector: "#generate-btn",
        side: "right",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/",
      },
      {
        icon: <PartyPopper />,
        title: "You made it.",
        content: (
          <>
            Now you can find you template here by simple searching by your
            template title. Thats it, go ahead and generate some documents.
          </>
        ),
        selector: "#search-input",
        side: "bottom",
        showControls: true,
        pointerPadding: 10,
        pointerRadius: 10,
        nextRoute: "/",
        prevRoute: "/documents/generate/new",
      },
    ],
  },
];

import { create } from "zustand";
import { produce } from "immer";
import { Editor } from "@tiptap/core";
import { TemplateFormSchema } from "../templates/schema";

interface FormState {
  editor: Editor | null;
  formState: TemplateFormSchema["schema"];
  progress: number;
  formUpdates: Array<string>;
  update: (
    val: Partial<Omit<FormState, "setFormValue" | "clearFormUpdates">>
  ) => void;
  reset: (formState: TemplateFormSchema["schema"]) => void;
  setFormValue: (id: string, value: string) => void;
  clearFormUpdates: (id: string) => void;
}
const initialData = {
  editor: null,
  formUpdates: [],
  formState: [],
  progress: 0,
};
export const useDocumentStore = create<FormState>((set) => ({
  ...initialData,
  update: (data) => set(data),
  reset: (formState) =>
    set({
      ...initialData,
      formState: formState.map((d) => ({
        ...d,
        value: "",
      })),
    }),
  clearFormUpdates: (id) =>
    set((state) => ({
      formUpdates: produce(state.formUpdates, (draft) => {
        return draft.filter((f) => f !== id);
      }),
    })),
  setFormValue: (id, value) =>
    set((state) => {
      const formState = produce(state.formState, (draft) => {
        const idx = draft.findIndex((f) => f.id === id);
        if (idx !== -1) draft[idx].value = value;

        return draft;
      });

      const totalFilledInputs = formState.reduce((acc, curr) => {
        if (curr.value) {
          acc += 1;
        }
        return acc;
      }, 0);
      const progress = Math.round(
        (totalFilledInputs / state.formState.length) * 100
      );
      return {
        formUpdates: [...state.formUpdates, id],
        formState,
        progress,
      };
    }),
}));

// state.update({
//   progress: (totalFilledInputs / state.formState.length) * 100,
// });

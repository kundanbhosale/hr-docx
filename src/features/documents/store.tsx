import { create } from "zustand";
import { produce } from "immer";
import { Editor } from "@tiptap/core";
import { TemplateFormSchema } from "../templates/schema";
import { Selectable } from "kysely";
import { Documents } from "@/_server/db/types";
import { createJSONStorage, persist } from "zustand/middleware";

interface FormState {
  id: string;
  template: string;

  title: string;
  editor: Editor | null;
  formState: TemplateFormSchema["schema"];
  progress: number;
  formUpdates: Array<string>;
  inputFocused?: boolean;
  nodeFocused: string;
  update: (
    val: Partial<Omit<FormState, "setFormValue" | "clearFormUpdates">>
  ) => void;
  reset: (formState: Selectable<Documents>) => void;
  setFormValue: (id: string, value: string) => void;
  clearFormUpdates: (id: string) => void;
}
const initialData = {
  id: "",
  template: "",
  title: "",
  nodeFocused: "",
  editor: null,
  formUpdates: [],
  formState: [],
  progress: 0,
  inputFocused: false,
};
export const useDocumentStore = create(
  persist<FormState>(
    (set) => ({
      ...initialData,
      update: (data) => set(data),
      reset: (data) =>
        set({
          ...initialData,
          id: data.id,
          template: data.template || "",
          title: data.title || "",
          formState: data.schema,
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
    }),
    {
      name: "doc-store", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({
        id: state.id,
        template: state.template,
        formState: state.formState,
      }),
    }
  )
);

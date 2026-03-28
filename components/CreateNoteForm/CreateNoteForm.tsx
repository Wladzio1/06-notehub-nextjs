"use client";

import css from "./CreateNoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/api";

interface Values {
  title: string;
  content: string;
  tag: string;
}

export default function CreateNoteForm({ onCancel }: { onCancel: () => void }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  return (
    <Formik<Values>
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      validationSchema={Yup.object({
        title: Yup.string().min(3).max(50).required(),
        content: Yup.string().max(500),
        tag: Yup.string().required(),
      })}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className={css.form}>
        <div>
          <Field name="title" placeholder="Title" className={css.input} />
          <ErrorMessage name="title" component="span" />
        </div>

        <div>
          <Field
            as="textarea"
            name="content"
            placeholder="Content"
            className={css.textarea}
          />
        </div>

        <div>
          <Field as="select" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit">Create note</button>
        </div>
      </Form>
    </Formik>
  );
}

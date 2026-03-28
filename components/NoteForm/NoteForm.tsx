"use client";

import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";

interface NoteFormProps {
  onCancel: () => void;
}

interface Values {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

export default function NoteForm({ onCancel }: NoteFormProps) {
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
        tag: Yup.mixed<Values["tag"]>()
          .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
          .required(),
      })}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label>Title</label>
          <Field name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label>Content</label>
          <Field as="textarea" name="content" className={css.textarea} />
        </div>

        <div className={css.formGroup}>
          <label>Tag</label>
          <Field as="select" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={mutation.isPending}
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}

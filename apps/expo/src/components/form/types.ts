import type { FormikConfig } from "formik";
import type { InferType, Schema } from "yup";

export type ValidationSchema<T extends Schema> = InferType<T>;

export type HandleSubmit<T extends Schema> = FormikConfig<
  ValidationSchema<T>
>["onSubmit"];

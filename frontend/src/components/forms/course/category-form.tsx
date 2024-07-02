import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import {
  Course,
  GetCourseByIdDocument,
  useUpdateCourseMutation,
} from '@/graphql/generated/schema';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CategoryFormProps {
  initialData: Omit<Course, 'user'>;
  courseId: string;
  options: {
    label: string;
    value: string;
  }[];
}

const formSchema = z.object({
  category: z.string().min(1, {
    message: 'Veuillez entrer une catégorie.',
  }),
});

export const CategoryForm = ({
  initialData,
  courseId,
  options,
}: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdition = () => setIsEditing((current) => !current);

  const [updateCourseMutation, updateCourseMutationResult] =
    useUpdateCourseMutation({
      onCompleted: (data) => {
        toast.success('Le cours a bien été modifié !', {
          style: {
            color: 'green',
          },
        });
        toggleEdition();
      },
      refetchQueries: [
        {
          query: GetCourseByIdDocument,
          variables: {
            getCourseByIdId: courseId,
          },
        },
      ],
      onError: (error) => {
        toast.error('Une erreur est survenue.', {
          style: {
            color: 'red',
          },
        });
      },
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: initialData.category?.id || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    updateCourseMutation({
      variables: {
        updateCourseId: courseId,
        data: {
          category: values.category,
        },
      },
    });
  }

  const selectedOption = options.find(
    (option) =>
      initialData.category && option.value === initialData?.category.id
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Catégorie du cours
        <Button variant={'ghost'} onClick={toggleEdition}>
          {isEditing ? (
            'Annuler'
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Modifier la catégorie
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.category && 'text-muted-foreground italic'
          )}
        >
          {selectedOption?.label || 'Aucune catégorie'}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Choisir la catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button
              type="submit"
              disabled={
                !isValid || isSubmitting || updateCourseMutationResult.loading
              }
            >
              Enregistrer
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

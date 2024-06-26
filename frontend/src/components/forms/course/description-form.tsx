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
  GetCourseByIdDocument,
  useUpdateCourseMutation,
} from '@/graphql/generated/schema';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

interface DescriptionFormProps {
  initialData: {
    description: string;
  };
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: 'Veuillez entrer une description.',
  }),
});

export const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
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
    defaultValues: initialData,
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
          description: values.description,
        },
      },
    });
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Description du cours
        <Button variant={'ghost'} onClick={toggleEdition}>
          {isEditing ? (
            'Annuler'
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Modifier la description
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.description && 'text-muted-foreground italic'
          )}
        >
          {initialData.description || 'Aucune description'}
        </p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={10}
                      placeholder="Ce cours est à propos de..."
                      disabled={
                        isSubmitting || updateCourseMutationResult.loading
                      }
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
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

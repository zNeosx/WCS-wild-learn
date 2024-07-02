import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Course,
  GetCourseByIdDocument,
  useUpdateCourseMutation,
} from '@/graphql/generated/schema';
import uploadFile from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ImageFormProps {
  initialData: Omit<Course, 'user'>;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: 'Veuillez choisir une image.',
  }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
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
      imageUrl: initialData.imageUrl ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    updateCourseMutation({
      variables: {
        updateCourseId: courseId,
        data: {
          imageUrl: values.imageUrl,
        },
      },
    });
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 space-y-2">
      <div className="font-medium flex items-center justify-between">
        Titre du cours
        <Button variant={'ghost'} onClick={toggleEdition}>
          {isEditing ? (
            'Annuler'
          ) : !initialData.imageUrl ? (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une image
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Modifier l&apos;image
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.imageUrl && (
        <div className="relative aspect-video">
          {/* <Image
            alt="Upload"
            fill
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          /> */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Upload"
            className="object-cover rounded-md"
            src={initialData.imageUrl}
          />
        </div>
      )}
      {!isEditing && !initialData.imageUrl && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      )}

      {isEditing && (
        <div>
          <Input
            type="file"
            onChange={(e) => {
              if (e.target.files?.[0])
                uploadFile(e.target.files?.[0]).then((url) => {
                  if (url) {
                    onSubmit({
                      imageUrl: url,
                    });
                  }
                });
            }}
          />
        </div>
      )}
      {/* {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Développement Web Avancé"
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
      )} */}
    </div>
  );
};

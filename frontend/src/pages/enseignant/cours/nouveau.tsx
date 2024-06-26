import AuthLayout from '@/components/auth-layout';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { z } from 'zod';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useCreateCourseMutation } from '@/graphql/generated/schema';
import { useRouter } from 'next/router';

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Veuillez entrer un titre.',
    })
    .max(50),
});

const NewCoursePage = () => {
  const router = useRouter();
  const [createCourseMutation, createCourseMutationResult] =
    useCreateCourseMutation({
      onCompleted: (data) => {
        toast.success('Le cours a bien été crée !', {
          style: {
            color: 'green',
          },
        });
        router.push(`/enseignant/cours/${data.createCourse.id}`);
      },
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    createCourseMutation({
      variables: {
        data: {
          title: values.title,
        },
      },
    });
  }

  return (
    <AuthLayout>
      <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-2">
        <div>
          <h1 className="text-2xl font-semibold">Définir un titre</h1>
          <p className="text-muted-foreground">
            Comment appelleriez-vous votre cours ? Ne vous inquiétez pas, vous
            pourrez le changer plus tard.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du cours</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Développement Web Avancé"
                        disabled={
                          isSubmitting || createCourseMutationResult.loading
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Qu&apos;allez-vous enseigner dans ce cours ?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2">
                <Link
                  href={'/enseignant/cours'}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                    })
                  )}
                >
                  Annuler
                </Link>
                <Button
                  type="submit"
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    createCourseMutationResult.loading
                  }
                >
                  Créer le cours
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default NewCoursePage;

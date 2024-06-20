import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSignUpMutation } from '@/graphql/generated/schema';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';

const formSchema = z.object({
  pseudo: z
    .string()
    .min(2, {
      message: 'Le pseudo doit contenir au moins 2 caractères.',
    })
    .max(50, {
      message: 'Le pseudo doit contenir au plus 50 caractères.',
    }),
  email: z
    .string()
    .min(1, {
      message: "L'adresse email est requise.",
    })
    .email({
      message: 'Adresse email invalide.',
    }),
  password: z.string().min(3, {
    message: 'Le mot de passe doit contenir au moins 3 caractères.',
  }),
});

const Inscription = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pseudo: '',
      email: '',
      password: '',
    },
  });

  const [signUpMutation, signUpMutationResult] = useSignUpMutation({
    onCompleted: () => {
      // toast({
      // 	icon: <BadgeCheck className="h-5 w-5" />,
      // 	title: "Inscription réussie",
      // 	className: "text-success",
      // });
      router.push('/auth/connexion');
    },
    onError: (err: ApolloError) => {
      console.error(err);
      // if (err.message.includes("already exist")) {
      // 	setErrorMessage("Cette adresse email est déjà utilisée.");
      // 	return;
      // }
      // setErrorMessage(defaultErrorMessage);
    },
  });

  const password = form.watch('password');
  const messageKOClassName = '';
  const messageOKClassName = 'text-green-700 dark:text-green-800';

  const messages: Array<{
    classname: { KO: string; OK: string };
    regex: boolean | null;
    message: string;
  }> = [
    {
      classname: { KO: messageKOClassName, OK: messageOKClassName },
      regex: !password || password?.length < 8,
      message: 'Contenir au moins 8 caractères',
    },
    {
      classname: { KO: messageKOClassName, OK: messageOKClassName },
      regex: !password || !/[A-Z]/.test(password),
      message: 'Contenir au moins une lettre majuscule.',
    },
    {
      classname: { KO: messageKOClassName, OK: messageOKClassName },
      regex: !password || !/[@./#&+-_\\,;:!^(){}]/.test(password),
      message: 'Contenir au moins un caractère spécial',
    },
    {
      classname: { KO: messageKOClassName, OK: messageOKClassName },
      regex: !password || !/[0-9]/.test(password),
      message: 'Contenir au moins un chiffre.',
    },
  ];

  const isPasswordValid = !messages.filter((message) => message.regex !== false)
    .length;

  function onSubmit(values: z.infer<typeof formSchema>) {
    signUpMutation({
      variables: {
        data: {
          email: values.email,
          pseudo: values.pseudo,
          password: values.password,
        },
      },
    });
  }

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Bienvenue !</CardTitle>
          <CardDescription>
            Entre tes informations pour te créer un compte.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="pseudo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-pseudo">Pseudo</FormLabel>
                        <FormControl>
                          <Input placeholder="Pseudo" {...field} />
                        </FormControl>
                        <FormDescription>
                          Ce sera votre nom public.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-email">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@gmail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="********"
                            type="password"
                            className={cn(
                              'peer',
                              isPasswordValid &&
                                'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-success-200'
                            )}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        {/* <Alert
                          variant={isPasswordValid ? 'success' : 'error'}
                          className="hidden peer-focus:block"
                        >
                          <Lock className="h-4 w-4 mt-1" />
                          <AlertTitle className="font-bold text-lg">
                            Le mot de passe doit :
                          </AlertTitle>
                          <AlertDescription>
                            {messages.length > 0 &&
                              messages.map((message, index) => (
                                <p
                                  key={index}
                                  className={cn(
                                    'text-md font-semibold flex gap-2',
                                    message.regex
                                      ? message.classname.KO
                                      : message.classname.OK
                                  )}
                                >
                                  {!message.regex ? (
                                    <CheckCircleIcon className="h-4 w-4 mt-1" />
                                  ) : (
                                    <XCircleIcon className="h-4 w-4 mt-1" />
                                  )}
                                  {message.message}
                                </p>
                              ))}
                          </AlertDescription>
                        </Alert> */}
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Crée mon compte
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Tu as déjà un compte ?{' '}
                <Link href="/auth/connexion" className="underline">
                  Je me connecte
                </Link>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default Inscription;

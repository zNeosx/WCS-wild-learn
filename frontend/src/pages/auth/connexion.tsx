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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { ApolloError } from '@apollo/client';
import {
  GetUserProfileDocument,
  useSignInMutation,
} from '@/graphql/generated/schema';
import { APP_ROUTES } from '@/constants';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CircleAlert } from 'lucide-react';

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "L'adresse email est requise.",
    })
    .email({
      message: "L'adresse email est invalide.",
    }),
  password: z.string().min(1, {
    message: 'Le mot de passe est requis.',
  }),
});

const Connexion = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [signInMutation, signInMutationResult] = useSignInMutation({
    onCompleted: (data) => {
      // toast({
      // 	icon: <BadgeCheck className="h-5 w-5" />,
      // 	title: "Connexion réussie",
      // 	className: "text-success",
      // });
      router.push(APP_ROUTES[data.signin.role].afterLogin ?? '/');
    },
    onError: (err: ApolloError) => {
      if (err.message.includes('not register')) {
        setErrorMessage("Aucun compte n'est lié à cette adresse email.");
        return;
      }
      if (err.message.includes('invalid password')) {
        setErrorMessage('Les identifiants sont incorrects.');
        return;
      }
      setErrorMessage(err.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInMutation({
      variables: {
        data: {
          email: values.email,
          password: values.password,
        },
      },
    });
  }

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Content de te revoir !</CardTitle>
          <CardDescription>
            Connecte-toi pour accéder à ton espace personnel.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-4">
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
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {errorMessage && (
                  <Alert variant={'destructive'}>
                    <CircleAlert className="h-5 w-5" />
                    <AlertTitle>Une erreur est survenue</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Je me connecte
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Tu n&apos;as pas de compte ?{' '}
                <Link href="/auth/inscription" className="underline">
                  Je m&apos;inscris
                </Link>
              </div>
            </CardContent>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default Connexion;

import AuthLayout from '@/components/auth-layout';
import { DescriptionForm } from '@/components/forms/course/description-form';
import { TitleForm } from '@/components/forms/course/title-form';
import { Loader } from '@/components/loader';
import { IconBadge } from '@/components/ui/icon-badge';
import { useGetCourseByIdQuery } from '@/graphql/generated/schema';
import { LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CourseDetailsPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const skipQuery = !id;

  const { data, loading, error } = useGetCourseByIdQuery({
    variables: { getCourseByIdId: id as string },
    skip: skipQuery,
  });

  useEffect(() => {
    if (isClient && !skipQuery && !loading && (!data || error)) {
      router.replace('/');
    }
  }, [isClient, skipQuery, loading, data, error, router]);

  if (!isClient || skipQuery || loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Erreur de chargement du cours</div>;
  }

  const course = data?.getCourseById;

  if (!course) {
    return null;
  }

  console.log('course :>> ', course);

  const requiredFields = [
    course.title,
    course.description,
    course.category,
    course.imageUrl,
    course.price,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  return (
    <AuthLayout>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Configuration du cours</h1>
            <span className="text-sm text-slate-700">
              Remplir tous les champs {completionText}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Personnalisez votre cours</h2>
            </div>
            <TitleForm courseId={course.id} initialData={course} />
            <DescriptionForm
              courseId={course.id}
              initialData={{
                description: course.description ?? '',
              }}
            />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CourseDetailsPage;

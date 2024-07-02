import AuthLayout from '@/components/auth-layout';
import { CategoryForm } from '@/components/forms/course/category-form';
import { DescriptionForm } from '@/components/forms/course/description-form';
import { ImageForm } from '@/components/forms/course/image-form';
import { PriceForm } from '@/components/forms/course/price-form';
import { TitleForm } from '@/components/forms/course/title-form';
import { Loader } from '@/components/loader';
import { IconBadge } from '@/components/ui/icon-badge';
import {
  useGetCategoriesQuery,
  useGetCourseByIdQuery,
} from '@/graphql/generated/schema';
import { cp } from 'fs';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';
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

  const getCourseQuery = useGetCourseByIdQuery({
    variables: { getCourseByIdId: id as string },
    skip: skipQuery,
  });
  const getCategoriesQuery = useGetCategoriesQuery();

  useEffect(() => {
    if (
      isClient &&
      !skipQuery &&
      !getCourseQuery.loading &&
      (!getCourseQuery.data || getCourseQuery.error) &&
      !getCategoriesQuery.loading &&
      (!getCategoriesQuery.data || getCategoriesQuery.error)
    ) {
      router.replace('/');
    }
  }, [
    isClient,
    skipQuery,
    getCourseQuery.loading,
    getCourseQuery.data,
    getCourseQuery.error,
    getCategoriesQuery.loading,
    getCategoriesQuery.data,
    getCategoriesQuery.error,
    router,
  ]);

  if (
    !isClient ||
    skipQuery ||
    getCourseQuery.loading ||
    getCategoriesQuery.loading
  ) {
    return <Loader />;
  }

  if (getCourseQuery.error || getCategoriesQuery.error) {
    return <div>Erreur de chargement du cours</div>;
  }

  const course = getCourseQuery.data?.getCourseById;

  const categories = getCategoriesQuery.data?.getCategories;

  if (!course) {
    return null;
  }

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
            <ImageForm courseId={course.id} initialData={course} />
            <CategoryForm
              courseId={course.id}
              initialData={course}
              options={
                categories
                  ? categories?.map((category) => ({
                      label: category.name,
                      value: category.id,
                    }))
                  : []
              }
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Chapitres du cours</h2>
              </div>
              <div>@Todo: Chapters</div>
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Vends ton cours</h2>
              </div>
              <PriceForm
                courseId={course.id}
                initialData={{
                  price: course.price ?? undefined,
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Ressources et pièces jointes</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default CourseDetailsPage;

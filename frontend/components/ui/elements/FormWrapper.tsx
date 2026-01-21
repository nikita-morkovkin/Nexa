import { type PropsWithChildren } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card';

interface FormWrapperProps {
  heading: string;
}

const FormWrapper = ({
  children,
  heading,
}: PropsWithChildren<FormWrapperProps>) => {
  return (
    <Card>
      <CardHeader className='pt-2 pb-2 pl-8'>
        <CardTitle className='text-lg'>{heading}</CardTitle>
      </CardHeader>
      <CardContent className='pl-2.5'>{children}</CardContent>
    </Card>
  );
};

export default FormWrapper;

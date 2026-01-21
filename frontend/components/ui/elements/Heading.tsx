import { cn } from '@/shared/utils/tw-merge.util';
import { cva, type VariantProps } from 'class-variance-authority';
import { type ClassValue } from 'clsx';

const headingSizes = cva('', {
  variants: {
    size: {
      sm: 'text-lg',
      default: 'text-2xl',
      large: 'text-4xl',
      xl: 'text-5xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

interface HeadingProps extends VariantProps<typeof headingSizes> {
  title: string;
  description?: string;
  classNames?: ClassValue;
}

const Heading = ({ size, title, description, classNames }: HeadingProps) => {
  return (
    <div className='space-y-2'>
      <h1
        className={cn(
          'font-semibold text-foreground',
          classNames,
          headingSizes({ size }),
        )}
      >
        {title}
      </h1>
      {description && <p className='text-muted-foreground'>{description}</p>}
    </div>
  );
};

export default Heading;

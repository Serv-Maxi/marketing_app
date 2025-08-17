import { Spinner } from "@/components/ui/shadcn-io/spinner";

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="text-primary mr-[12px]" variant="circle" />
      <span>Loading...</span>
    </div>
  );
};
export default LoadingComponent;

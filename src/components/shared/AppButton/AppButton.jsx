import { Button, Spinner } from "flowbite-react";


export default function AppButton({ children, isLoading , disabled  , ...props }) {
  return (
    <>
      <Button className="cursor-pointer " disabled={disabled} {...props} color="purple">
        {isLoading && (
          <Spinner
            className="me-1"
            aria-label="Spinner button example"
            size="sm"
            light
          />
        )}
        {children}
      </Button>
    </>
  );
}

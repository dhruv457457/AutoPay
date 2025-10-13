"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "../../lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

interface SheetOverlayProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {
  className?: string;
}

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  SheetOverlayProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

// --- MODIFICATION START ---
// We are changing the transition properties to create a smoother, more refined animation.
const sheetVariants = cva(
  "fixed z-50 bg-background p-6 shadow-lg transition-[transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] gap-4 data-[state=open]:animate-in data-[state=closed]:animate-out",
  // Note: The previous 'transition ease-in-out' and separate durations have been replaced by a unified, smoother transition property.
  // The cubic-bezier function creates a "deceleration" curve, making the animation feel more physical and responsive.
  // --- MODIFICATION END ---
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);


interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  className?: string;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
        className="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

// ... The rest of the file (SheetHeader, SheetFooter, etc.) remains the same ...
interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
  }
  
  const SheetHeader = ({ className, ...props }: DivProps) => (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
  SheetHeader.displayName = "SheetHeader";
  
  const SheetFooter = ({ className, ...props }: DivProps) => (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        className
      )}
      {...props}
    />
  );
  SheetFooter.displayName = "SheetFooter";
  
  interface SheetTitleProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> {
    className?: string;
  }
  
  const SheetTitle = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Title>,
    SheetTitleProps
  >(({ className, ...props }, ref) => (
    <SheetPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  ));
  SheetTitle.displayName = SheetPrimitive.Title.displayName;
  
  interface SheetDescriptionProps
    extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> {
    className?: string;
  }
  
  const SheetDescription = React.forwardRef<
    React.ElementRef<typeof SheetPrimitive.Description>,
    SheetDescriptionProps
  >(({ className, ...props }, ref) => (
    <SheetPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ));
  SheetDescription.displayName = SheetPrimitive.Description.displayName;
  
  export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
  };
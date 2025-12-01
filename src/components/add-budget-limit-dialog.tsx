"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/types/models";
import { useIsMobile } from "@/hooks/useMediaQuery";

const formSchema = z.object({
  category: z.string().min(1, "Category is required"),
  limit: z.number().positive("Limit must be positive"),
  comments: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function BudgetLimitForm({
  form,
  onSubmit,
  isLoading,
  onCancel,
}: {
  form: ReturnType<typeof useForm<FormData>>;
  onSubmit: (values: FormData) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Limit (₩)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100000"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Budget reminder notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Setting..." : "Set Limit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function AddBudgetLimitDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      category: "",
      limit: 0,
      comments: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/budget-limits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to add budget limit");
      }

      form.reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error adding budget limit:", error);
      alert("Failed to add budget limit");
    } finally {
      setIsLoading(false);
    }
  }

  const triggerButton = (
    <Button variant="outline">
      <Settings className="mr-2 h-4 w-4" />
      Set Budget Limit
    </Button>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Set Budget Limit</DrawerTitle>
            <DrawerDescription>
              Set a spending limit for a category
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto max-h-[60vh]">
            <BudgetLimitForm
              form={form}
              onSubmit={onSubmit}
              isLoading={isLoading}
              onCancel={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Budget Limit</DialogTitle>
          <DialogDescription>
            Set a spending limit for a category
          </DialogDescription>
        </DialogHeader>
        <BudgetLimitForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

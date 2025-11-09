"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Directory } from "@/types";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  directory: Directory;
}

type ReportType = "NON_FUNCTIONAL" | "INACTIVE_SERVICE" | "INCORRECT_INFO" | "OTHER";

const reportTypeLabels: Record<ReportType, string> = {
  NON_FUNCTIONAL: "Non-functional Service Provider",
  INACTIVE_SERVICE: "Inactive Service",
  INCORRECT_INFO: "Incorrect Information",
  OTHER: "Other",
};

export default function ReportDialog({
  open,
  onOpenChange,
  directory,
}: ReportDialogProps) {
  const [reportType, setReportType] = useState<ReportType | "">("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportType || !description.trim()) {
      toast.error("Please select a report type and provide a description");
      return;
    }

    if (description.trim().length < 10) {
      toast.error("Please provide a more detailed description (at least 10 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          directoryId: directory.id,
          reportType,
          description: description.trim(),
          reporterName: reporterName.trim() || null,
          reporterEmail: reporterEmail.trim() || null,
          reporterPhone: reporterPhone.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit report");
      }

      toast.success("Report submitted successfully. Thank you for your feedback!");
      
      // Reset form
      setReportType("");
      setDescription("");
      setReporterName("");
      setReporterEmail("");
      setReporterPhone("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-[500px] max-h-[90vh] overflow-y-auto w-[calc(100vw-2rem)] sm:w-full"
      >
        <div className="text-center space-y-2 mb-4">
          <DialogTitle className="text-xl font-semibold">Report Issue</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Report an issue with <strong>{directory.nameOfOrganization}</strong>
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reportType">
                Issue Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={reportType}
                onValueChange={(value) => setReportType(value as ReportType)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(reportTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Please provide details about the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                minLength={10}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters required
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reporterName">Your Name (Optional)</Label>
              <Input
                id="reporterName"
                placeholder="John Doe"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reporterEmail">Your Email (Optional)</Label>
              <Input
                id="reporterEmail"
                type="email"
                placeholder="john@example.com"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reporterPhone">Your Phone (Optional)</Label>
              <Input
                id="reporterPhone"
                type="tel"
                placeholder="+250788123456"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


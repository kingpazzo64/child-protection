'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Directory } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Phone, Mail, Share2, Flag, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { urgencyLabels } from '@/types/urgencyLabels';
import ReportDialog from "./ReportDialog";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ServiceCardProps {
  directory: Directory;
}

const ServiceCard = ({ directory }: ServiceCardProps) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  function addCommas(input: number | null | undefined) {
    input = input ?? 0;
    const [intPart, decPart] = input.toString().split('.');
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart ? `${withCommas}.${decPart}` : withCommas;
  }

  const generateShareText = () => {
    const services = directory.services?.map((s: any) => s.service.name).join(", ") || "N/A";
    const locations = directory.locations?.map((loc) => 
      `${loc.district.name} - ${loc.sector.name}`
    ).join("; ") || "N/A";
    
    return `${t.serviceCard.shareTitle}: ${directory.nameOfOrganization}

${t.serviceCard.services}: ${services}
${t.serviceCard.location}: ${locations}
${directory.phone ? `${t.serviceCard.phone}: ${directory.phone}` : ''}
${directory.email ? `${t.serviceCard.email}: ${directory.email}` : ''}
${directory.website ? `${t.serviceCard.website}: ${directory.website}` : ''}

${t.serviceCard.foundVia}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: `${directory.nameOfOrganization} - ${t.serviceCard.shareTitle}`,
      text: generateShareText(),
      url: window.location.href,
    };

    try {
      // Try Web Share API first (mobile and some desktop browsers)
      if (navigator.share) {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
        toast.success(t.serviceCard.shareSuccess);
      } else {
        // Fallback to clipboard
        const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
        toast.success(t.serviceCard.linkCopied);
      }
    } catch (error: any) {
      // User cancelled share or error occurred
      if (error.name !== "AbortError") {
        // Try clipboard as fallback if share failed
        try {
          const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
          await navigator.clipboard.writeText(shareText);
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
          toast.success(t.serviceCard.linkCopied);
        } catch (clipboardError) {
          toast.error(t.serviceCard.shareError);
        }
      }
    }
  };

  const handleReport = () => {
    setIsReportDialogOpen(true);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-left space-y-1">
                <CardTitle className="text-lg font-bold text-foreground mb-2">
                  {directory.nameOfOrganization}
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                  {directory.services?.map((s: any) => (
                    <Badge
                      key={s.service.id}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20"
                    > 
                      {s.service.name}
                    </Badge>
                  ))}
                </div> 
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-success border-success">
                  {Boolean(directory.paid) ? t.serviceCard.paid : t.serviceCard.free}
                </Badge>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Beneficiaries */}
            {directory.beneficiaries?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">{t.serviceCard.beneficiariesLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {directory.beneficiaries.map((b) => (
                    <Badge key={b.beneficiary.id} variant="outline" className="text-xs border-muted">
                      {urgencyLabels[b.beneficiary.name] ?? b.beneficiary.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Locations */}
            {directory.locations?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-foreground mb-1">{t.serviceCard.locations}</p>
                <div className="space-y-1 text-sm">
                  {directory.locations.map((loc, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">
                        {`${loc.district.name} - ${loc.sector.name} - ${loc.cell.name} - ${loc.village.name}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="space-y-1 text-sm mt-2">
              {directory.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{directory.phone}</span>
                </div>
              )}
              {directory.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{directory.email}</span>
                </div>
              )}
            </div>

            {/* Other Services */}
            {directory.otherServices && (
              <div className="pt-2">
                <p className="text-sm font-medium text-foreground mb-2">{t.serviceCard.otherServices}</p>
                <div className="flex flex-wrap gap-1">
                  {directory.otherServices.split(';').map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-muted-foreground border-muted">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary hover:text-primary/80"
                onClick={handleShare}
              >
                {shareSuccess ? (
                  <Check className="w-3 h-3 mr-1" />
                ) : (
                  <Share2 className="w-3 h-3 mr-1" />
                )}
                {shareSuccess ? t.serviceCard.copied : t.serviceCard.share}
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
                onClick={handleReport}
              >
                <Flag className="w-3 h-3 mr-1" />
                {t.serviceCard.reportIncorrect}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <ReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        directory={directory}
      />
    </Card>
  );
};

export default ServiceCard;

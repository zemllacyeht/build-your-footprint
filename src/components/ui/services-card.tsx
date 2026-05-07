"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Plus } from "lucide-react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type CarouselApi = UseEmblaCarouselType[1];

export interface Service {
  number: string;
  tag?: string;
  title: string;
  description: string;
  icon: React.ElementType;
  details?: string[];
}

const ServiceCard = ({
  service,
  index,
  isOpen,
  onOpen,
  onClose,
  isMobile,
}: {
  service: Service;
  index: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isMobile: boolean;
}) => {
  const Icon = service.icon;

  const handleClick = () => {
    if (!isMobile) return;
    if (isOpen) onClose();
    else onOpen();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      onMouseEnter={!isMobile ? onOpen : undefined}
      onClick={handleClick}
      className={cn(
        "glass glass-hover rounded-2xl p-8 md:p-10 relative overflow-hidden group cursor-pointer",
        "flex flex-col justify-between",
        "transition-[border-color,box-shadow] duration-500",
        isOpen && "border-primary/40"
      )}
      animate={{
        height: isOpen ? "auto" : 380,
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: 380 }}
    >
      <div
        className={cn(
          "absolute top-0 left-8 right-8 h-px bg-gradient-gold transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />
      <div
        className={cn(
          "absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-opacity duration-700",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="relative flex items-start justify-between mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">
          {service.tag ?? "Service"}
        </span>
        <div
          className={cn(
            "h-12 w-12 rounded-lg glass grid place-items-center transition-all duration-500",
            isOpen && "bg-gradient-primary border-transparent"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5 text-primary transition-colors",
              isOpen && "text-primary-foreground"
            )}
          />
        </div>
      </div>

      <div className="relative">
        <h3 className="font-display text-3xl md:text-4xl font-light leading-tight mb-4">
          {service.title}
        </h3>
        <div className="h-px w-12 bg-gradient-gold mb-5" />
        <p className="text-muted-foreground leading-relaxed">
          {service.description}
        </p>

        <AnimatePresence initial={false}>
          {isOpen && service.details && service.details.length > 0 && (
            <motion.ul
              key="details"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 space-y-3 overflow-hidden"
            >
              {service.details.map((d) => (
                <li key={d} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {isMobile && (
          <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
            <Plus
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                isOpen && "rotate-45"
              )}
            />
            {isOpen ? "Close" : "Tap for details"}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ServiceCarousel = ({ services }: { services: Service[] }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const isMobile = useIsMobile();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("reInit", (api) => {
      onSelect(api);
      setScrollSnaps(api.scrollSnapList());
    });
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-6 items-start">
          {services.map((service, index) => (
            <div
              key={service.number}
              className={cn(
                "pl-6 shrink-0 grow-0",
                "basis-[85%] sm:basis-[60%] md:basis-[45%] lg:basis-[33.333%]"
              )}
            >
              <ServiceCard
                service={service}
                index={index}
                isOpen={openIndex === index}
                onOpen={() => setOpenIndex(index)}
                onClose={() =>
                  setOpenIndex((curr) => (curr === index ? null : curr))
                }
                isMobile={isMobile}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 mt-10">
        <div className="flex items-center gap-2 flex-wrap">
          {scrollSnaps.map((_, i) => {
            const active = i === selectedIndex;
            return (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  active
                    ? "w-8 bg-gradient-gold"
                    : "w-2 bg-foreground/20 hover:bg-foreground/40"
                )}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="glass"
            size="icon"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous"
            className="h-12 w-12 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next"
            className="h-12 w-12 rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, differenceInDays } from "date-fns";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Plus,
  Trash2,
  Bell,
  Filter,
  Download,
  Calculator,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DEADLINE_RULES,
  DEADLINE_CATEGORIES,
  calculateDeadline,
  type DeadlineRule,
  type CalculatedDeadline,
  type DeadlineCategory,
} from "@/lib/deadline-calculator";
import { cn } from "@/lib/utils";

interface SavedDeadline {
  id: string;
  rule: DeadlineRule;
  startDate: Date;
  caseName: string;
  notes?: string;
}

const JURISDICTIONS = [
  { id: "ON", name: "Ontario" },
  { id: "BC", name: "British Columbia" },
  { id: "AB", name: "Alberta" },
  { id: "FED", name: "Federal" },
  { id: "ALL", name: "All Jurisdictions" },
];

const categoryIcons: Record<DeadlineCategory, typeof Calendar> = {
  service: Clock,
  response: CheckCircle2,
  motion: Calendar,
  appeal: ChevronRight,
  discovery: Filter,
  trial: Calendar,
  limitation: AlertTriangle,
};

export default function DeadlinesPage() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("ON");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRule, setSelectedRule] = useState<DeadlineRule | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [calculatedDeadline, setCalculatedDeadline] =
    useState<CalculatedDeadline | null>(null);
  const [savedDeadlines, setSavedDeadlines] = useState<SavedDeadline[]>([]);
  const [caseName, setCaseName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRules = useMemo(() => {
    return DEADLINE_RULES.filter((rule) => {
      const matchesJurisdiction =
        selectedJurisdiction === "ALL" ||
        rule.jurisdiction === selectedJurisdiction ||
        rule.jurisdiction === "ALL";
      const matchesCategory =
        selectedCategory === "all" || rule.category === selectedCategory;
      return matchesJurisdiction && matchesCategory;
    });
  }, [selectedJurisdiction, selectedCategory]);

  const handleCalculate = () => {
    if (selectedRule && startDate) {
      const result = calculateDeadline(selectedRule, startDate);
      setCalculatedDeadline(result);
    }
  };

  const handleSaveDeadline = () => {
    if (calculatedDeadline && caseName) {
      const newDeadline: SavedDeadline = {
        id: Date.now().toString(),
        rule: calculatedDeadline.rule,
        startDate: calculatedDeadline.startDate,
        caseName,
        notes: calculatedDeadline.warnings.join("; "),
      };
      setSavedDeadlines((prev) => [...prev, newDeadline]);
      setCaseName("");
      setDialogOpen(false);
    }
  };

  const handleDeleteDeadline = (id: string) => {
    setSavedDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  const upcomingDeadlines = useMemo(() => {
    return savedDeadlines
      .map((saved) => {
        const calculated = calculateDeadline(saved.rule, saved.startDate);
        return { ...saved, calculated };
      })
      .sort((a, b) => a.calculated.daysRemaining - b.calculated.daysRemaining);
  }, [savedDeadlines]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative border-b border-border/50 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Deadline Calculator
              </h1>
              <p className="text-muted-foreground">
                Calculate legal deadlines for Canadian courts
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Calculate Deadline
                </CardTitle>
                <CardDescription>
                  Select a deadline rule and start date to calculate the due
                  date
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Jurisdiction</Label>
                    <Select
                      value={selectedJurisdiction}
                      onValueChange={setSelectedJurisdiction}
                    >
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        {JURISDICTIONS.map((j) => (
                          <SelectItem key={j.id} value={j.id}>
                            {j.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="bg-background border-border/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {DEADLINE_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rule Selection */}
                <div className="space-y-2">
                  <Label className="text-foreground">Deadline Rule</Label>
                  <Select
                    value={selectedRule?.id || ""}
                    onValueChange={(id) => {
                      const rule = DEADLINE_RULES.find((r) => r.id === id);
                      setSelectedRule(rule || null);
                      setCalculatedDeadline(null);
                    }}
                  >
                    <SelectTrigger className="bg-background border-border/50">
                      <SelectValue placeholder="Select a deadline rule" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredRules.map((rule) => (
                        <SelectItem key={rule.id} value={rule.id}>
                          <div className="flex flex-col">
                            <span>{rule.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {rule.court} - {rule.baseDays}{" "}
                              {rule.businessDays ? "business" : "calendar"} days
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rule Details */}
                {selectedRule && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm text-foreground font-medium">
                          {selectedRule.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedRule.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20"
                          >
                            {selectedRule.baseDays}{" "}
                            {selectedRule.businessDays
                              ? "business"
                              : "calendar"}{" "}
                            days
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-muted text-muted-foreground border-border"
                          >
                            {selectedRule.court}
                          </Badge>
                          {selectedRule.excludeHolidays && (
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-400 border-amber-500/20"
                            >
                              Excludes Holidays
                            </Badge>
                          )}
                        </div>
                        {selectedRule.source && (
                          <p className="text-xs text-muted-foreground">
                            Source: {selectedRule.source}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label className="text-foreground">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background border-border/50",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Calculate Button */}
                <Button
                  onClick={handleCalculate}
                  disabled={!selectedRule || !startDate}
                  className="w-full"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Deadline
                </Button>

                {/* Result */}
                {calculatedDeadline && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                      "p-6 rounded-lg border",
                      calculatedDeadline.isOverdue
                        ? "bg-destructive/10 border-destructive/30"
                        : calculatedDeadline.daysRemaining <= 7
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-emerald-500/10 border-emerald-500/30"
                    )}
                  >
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Deadline
                        </p>
                        <p className="text-3xl font-bold text-foreground">
                          {format(calculatedDeadline.dueDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                          calculatedDeadline.isOverdue
                            ? "bg-destructive/20 text-destructive"
                            : calculatedDeadline.daysRemaining <= 7
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        )}
                      >
                        {calculatedDeadline.isOverdue ? (
                          <>
                            <AlertTriangle className="h-4 w-4" />
                            {Math.abs(calculatedDeadline.daysRemaining)} days
                            overdue
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4" />
                            {calculatedDeadline.daysRemaining} days remaining
                          </>
                        )}
                      </div>
                      {calculatedDeadline.warnings.length > 0 && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          {calculatedDeadline.warnings.map((warning, i) => (
                            <p key={i}>{warning}</p>
                          ))}
                        </div>
                      )}
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mt-4">
                            <Bell className="h-4 w-4 mr-2" />
                            Save to My Deadlines
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">
                              Save Deadline
                            </DialogTitle>
                            <DialogDescription>
                              Add a case name to track this deadline
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label className="text-foreground">
                                Case Name
                              </Label>
                              <Input
                                placeholder="e.g., Smith v. Jones"
                                value={caseName}
                                onChange={(e) => setCaseName(e.target.value)}
                                className="bg-background border-border/50"
                              />
                            </div>
                            <Button
                              onClick={handleSaveDeadline}
                              disabled={!caseName}
                              className="w-full"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Save Deadline
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Common Rules Reference */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Common Deadline Rules
                </CardTitle>
                <CardDescription>
                  Quick reference for frequently used deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="response" className="space-y-4">
                  <TabsList className="bg-muted/50 border border-border/50">
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger value="motion">Motion</TabsTrigger>
                    <TabsTrigger value="appeal">Appeal</TabsTrigger>
                    <TabsTrigger value="limitation">Limitation</TabsTrigger>
                  </TabsList>
                  {(["response", "motion", "appeal", "limitation"] as const).map(
                    (category) => (
                      <TabsContent key={category} value={category}>
                        <div className="space-y-2">
                          {DEADLINE_RULES.filter(
                            (r) => r.category === category
                          ).map((rule) => (
                            <TooltipProvider key={rule.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => {
                                      setSelectedRule(rule);
                                      setCalculatedDeadline(null);
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        {(() => {
                                          const Icon = categoryIcons[rule.category];
                                          return (
                                            <Icon className="h-4 w-4 text-primary" />
                                          );
                                        })()}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-foreground">
                                          {rule.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {rule.jurisdiction} - {rule.court}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="bg-muted text-foreground"
                                    >
                                      {rule.baseDays}{" "}
                                      {rule.businessDays ? "bus." : "cal."} days
                                    </Badge>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">{rule.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </TabsContent>
                    )
                  )}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Saved Deadlines Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  My Deadlines
                </CardTitle>
                <CardDescription>
                  {savedDeadlines.length === 0
                    ? "No saved deadlines yet"
                    : `${savedDeadlines.length} tracked deadline${
                        savedDeadlines.length !== 1 ? "s" : ""
                      }`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">
                      Calculate a deadline and save it to track it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline) => (
                      <motion.div
                        key={deadline.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-3 rounded-lg border",
                          deadline.calculated.isOverdue
                            ? "bg-destructive/10 border-destructive/30"
                            : deadline.calculated.daysRemaining <= 7
                            ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-muted/30 border-border/50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {deadline.caseName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {deadline.rule.name}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  deadline.calculated.isOverdue
                                    ? "bg-destructive/20 text-destructive border-destructive/30"
                                    : deadline.calculated.daysRemaining <= 7
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                )}
                              >
                                {deadline.calculated.isOverdue
                                  ? `${Math.abs(
                                      deadline.calculated.daysRemaining
                                    )}d overdue`
                                  : `${deadline.calculated.daysRemaining}d left`}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(deadline.calculated.dueDate, "MMM d")}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteDeadline(deadline.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground text-sm">
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Business days</strong>{" "}
                  exclude weekends and statutory holidays.
                </p>
                <p>
                  <strong className="text-foreground">Calendar days</strong>{" "}
                  include all days, but if the deadline falls on a weekend or
                  holiday, it moves to the next business day.
                </p>
                <p>
                  Always verify deadlines with the applicable rules of court.
                  Extensions may be available in certain circumstances.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

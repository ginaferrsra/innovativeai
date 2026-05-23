'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search, BookOpen, Clock, ExternalLink, ChevronRight,
  Scale, FileText, Users, Shield, Briefcase, Home, Gavel,
  GraduationCap, PlayCircle, CheckSquare, FileQuestion,
  ArrowLeft, Link2,
} from 'lucide-react';
import {
  type LearningResource,
  type LearningCategory,
  type ResourceType,
  LEARNING_CATEGORIES,
  LEARNING_RESOURCES,
  searchResources,
  getResourceById,
  getRelatedResources,
} from '@/lib/learning-resources';

const CATEGORY_ICONS: Record<LearningCategory, React.ElementType> = {
  court_procedures: Gavel,
  legal_documents: FileText,
  self_representation: Users,
  charter_rights: Shield,
  civil_procedure: Scale,
  criminal_procedure: Briefcase,
  family_law: Home,
  small_claims: FileQuestion,
  appeals: ChevronRight,
};

const TYPE_ICONS: Record<ResourceType, React.ElementType> = {
  tutorial: GraduationCap,
  guide: BookOpen,
  checklist: CheckSquare,
  template: FileText,
  video: PlayCircle,
  article: FileText,
  faq: FileQuestion,
};

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  intermediate: 'bg-amber-100 text-amber-800 border-amber-200',
  advanced: 'bg-red-100 text-red-800 border-red-200',
};

export function LearningHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LearningCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedResource, setSelectedResource] = useState<LearningResource | null>(null);
  const [isResourceOpen, setIsResourceOpen] = useState(false);

  const filteredResources = useMemo(() => {
    return searchResources(
      searchQuery,
      selectedCategory === 'all' ? undefined : selectedCategory,
      selectedDifficulty
    );
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const resourcesByCategory = useMemo(() => {
    const grouped: Record<string, LearningResource[]> = {};
    for (const resource of filteredResources) {
      if (!grouped[resource.category]) {
        grouped[resource.category] = [];
      }
      grouped[resource.category].push(resource);
    }
    return grouped;
  }, [filteredResources]);

  const openResource = (resource: LearningResource) => {
    setSelectedResource(resource);
    setIsResourceOpen(true);
  };

  const relatedResources = useMemo(() => {
    if (!selectedResource) return [];
    return getRelatedResources(selectedResource.id);
  }, [selectedResource]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Legal Learning Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {LEARNING_RESOURCES.length} tutorials, guides, and resources to help you navigate the legal system
          </p>
        </div>
        <Badge variant="secondary">
          <GraduationCap className="h-3 w-3 mr-1" />
          Self-Help Resources
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tutorials, guides, and resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as LearningCategory | 'all')}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {LEARNING_CATEGORIES.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 justify-start bg-transparent p-0">
          <TabsTrigger
            value="all"
            onClick={() => setSelectedCategory('all')}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All
          </TabsTrigger>
          {LEARNING_CATEGORIES.slice(0, 6).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            return (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-1.5"
              >
                <Icon className="h-3 w-3" />
                {cat.name}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* Results Count */}
      <p className="text-xs text-muted-foreground">
        Showing {filteredResources.length} of {LEARNING_RESOURCES.length} resources
      </p>

      {/* Featured Resources */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Start Here</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {LEARNING_RESOURCES.filter(r => 
              ['court-101', 'self-rep-basics', 'charter-overview'].includes(r.id)
            ).map((resource) => {
              const Icon = CATEGORY_ICONS[resource.category];
              return (
                <Card
                  key={resource.id}
                  className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
                  onClick={() => openResource(resource)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{resource.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {resource.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {resource.duration}
                          </Badge>
                          <Badge className={`text-xs border ${DIFFICULTY_COLORS[resource.difficulty]}`}>
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Resources by Category */}
      <div className="space-y-6">
        {Object.entries(resourcesByCategory).map(([category, resources]) => {
          const categoryInfo = LEARNING_CATEGORIES.find(c => c.id === category);
          const Icon = CATEGORY_ICONS[category as LearningCategory];
          
          return (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  {categoryInfo?.name || category}
                </h2>
                <Badge variant="secondary" className="text-xs">
                  {resources.length}
                </Badge>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => {
                  const TypeIcon = TYPE_ICONS[resource.type];
                  return (
                    <Card
                      key={resource.id}
                      className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all group"
                      onClick={() => openResource(resource)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <TypeIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground capitalize">
                                {resource.type}
                              </span>
                            </div>
                            <p className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {resource.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {resource.description}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {resource.duration}
                          </Badge>
                          <Badge className={`text-xs border ${DIFFICULTY_COLORS[resource.difficulty]}`}>
                            {resource.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-1">No resources found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Resource Detail Modal */}
      <Dialog open={isResourceOpen} onOpenChange={setIsResourceOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {selectedResource && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsResourceOpen(false)}
                    className="h-8 px-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                </div>
                <DialogTitle className="text-xl">{selectedResource.title}</DialogTitle>
                <DialogDescription>{selectedResource.description}</DialogDescription>
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {selectedResource.duration}
                  </Badge>
                  <Badge className={`border ${DIFFICULTY_COLORS[selectedResource.difficulty]}`}>
                    {selectedResource.difficulty}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {selectedResource.type}
                  </Badge>
                  {selectedResource.topics.slice(0, 3).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto py-4">
                {/* Main Content */}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div 
                    className="whitespace-pre-wrap text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedResource.content
                        .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mt-6 mb-3">$1</h1>')
                        .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold mt-5 mb-2">$1</h2>')
                        .replace(/^### (.*$)/gm, '<h3 class="text-base font-medium mt-4 mb-2">$1</h3>')
                        .replace(/^#### (.*$)/gm, '<h4 class="text-sm font-medium mt-3 mb-1">$1</h4>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^\- (.*$)/gm, '<li class="ml-4">$1</li>')
                        .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
                    }}
                  />
                </div>

                {/* External Links */}
                {selectedResource.externalLinks && selectedResource.externalLinks.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      External Resources
                    </h4>
                    <div className="grid gap-2">
                      {selectedResource.externalLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm"
                        >
                          <ExternalLink className="h-4 w-4 text-primary" />
                          <span className="flex-1">{link.title}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {link.type}
                          </Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Resources */}
                {relatedResources.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Related Resources</h4>
                    <div className="grid gap-2">
                      {relatedResources.map((related) => (
                        <Card
                          key={related.id}
                          className="cursor-pointer hover:bg-secondary/50 transition-colors"
                          onClick={() => setSelectedResource(related)}
                        >
                          <CardContent className="py-3 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{related.title}</p>
                              <p className="text-xs text-muted-foreground">{related.duration}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Help Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            Need More Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p className="text-muted-foreground">
            These resources are for general information only and do not constitute legal advice.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.legalaid.on.ca/" target="_blank" rel="noopener noreferrer">
                Legal Aid Ontario
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.lawsociety.bc.ca/working-with-lawyers/finding-a-lawyer-referral-services/" target="_blank" rel="noopener noreferrer">
                Find a Lawyer
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://stepstojustice.ca/" target="_blank" rel="noopener noreferrer">
                Steps to Justice
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

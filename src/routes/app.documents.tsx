import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText, Upload, Download, CheckCircle2, Clock, Search,
  ChevronRight, Eye, MoreVertical, Trash2, Edit3, Sparkles,
  FolderOpen, File, Image, FileSpreadsheet, Lock, GraduationCap,
} from "lucide-react";
import {
  SCHOOL_DOCUMENTS, PRIVATE_DOCUMENTS,
  STATUS_CONFIG, CATEGORY_CONFIG,
} from "@/lib/scholarii/documents-mock-data";
import type { Document, DocumentTab } from "@/lib/scholarii/documents-mock-data";

export const Route = createFileRoute("/app/documents")({ component: DocumentsPage });

const TAB_LIST: { id: DocumentTab; label: string; icon: React.ReactNode }[] = [
  { id: "school", label: "School Documents", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "private", label: "My Documents", icon: <Lock className="h-4 w-4" /> },
];

const FILE_TYPE_ICONS: Record<string, typeof File> = {
  "application/pdf": FileText,
  "image/jpeg": Image,
  "image/png": Image,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileSpreadsheet,
};

function getFileIcon(fileType: string | null): typeof File {
  if (!fileType) return File;
  return FILE_TYPE_ICONS[fileType] ?? File;
}

function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocumentTab>("school");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const documents = activeTab === "school" ? SCHOOL_DOCUMENTS : PRIVATE_DOCUMENTS;

  const filteredDocs = useMemo(() => {
    let docs = documents;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.status.toLowerCase().includes(q)
      );
    }
    return docs;
  }, [documents, searchQuery]);

  const schoolStats = useMemo(() => {
    const total = SCHOOL_DOCUMENTS.length;
    const uploaded = SCHOOL_DOCUMENTS.filter((d) => d.status === "uploaded" || d.status === "verified").length;
    const verified = SCHOOL_DOCUMENTS.filter((d) => d.status === "verified").length;
    const pending = SCHOOL_DOCUMENTS.filter((d) => d.status === "uploaded" || d.status === "requested").length;
    return { total, uploaded, verified, pending };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
            <p className="text-sm text-muted-foreground">Manage school documents and your personal records.</p>
          </div>
        </div>
      </div>

      {/* Metric Cards - always visible above tabs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Required Documents", value: schoolStats.total, icon: FolderOpen, color: "from-slate-500 to-slate-600", shadow: "shadow-slate-500/20" },
          { label: "Uploaded", value: schoolStats.uploaded, icon: Upload, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
          { label: "Verified", value: schoolStats.verified, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
          { label: "Pending Verification", value: schoolStats.pending, icon: Clock, color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20" },
        ].map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg ${stat.shadow}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 -mx-6 bg-background/80 px-6 backdrop-blur-xl md:-mx-8 md:px-8">
        <div className="flex gap-1 border-b">
          {TAB_LIST.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {tab.id === "school" ? schoolStats.total : PRIVATE_DOCUMENTS.length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Actions - below tabs, above content */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={activeTab === "school" ? "Search school documents..." : "Search private documents..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
          <Upload className="mr-1.5 h-4 w-4" />
          Upload
        </Button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "school" && (
          <div className="space-y-3">
            {filteredDocs.length === 0 ? (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                    <FileText className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">No documents found</p>
                  <p className="text-xs text-muted-foreground/70">Try adjusting your search</p>
                </CardContent>
              </Card>
            ) : (
              filteredDocs.map((doc) => {
                const statusCfg = STATUS_CONFIG[doc.status];
                const catCfg = CATEGORY_CONFIG[doc.category];
                const FileIcon = getFileIcon(doc.fileType);
                return (
                  <Card
                    key={doc.id}
                    className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
                    onClick={() => { setSelectedDoc(doc); setDetailOpen(true); }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted/50">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold">{doc.name}</h3>
                            <Badge variant="outline" className={`shrink-0 border ${statusCfg.border} ${statusCfg.bg} ${statusCfg.color}`}>
                              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                              {statusCfg.label}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className={`rounded-md px-1.5 py-0.5 ${catCfg.bg} ${catCfg.color}`}>{catCfg.label}</span>
                            {doc.uploadDate && <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                            {doc.verifiedBy && <span>Verified by {doc.verifiedBy}</span>}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {activeTab === "private" && (
          <div className="space-y-4">
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Lock className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-emerald-500">Private Documents</p>
                  <p className="text-xs text-muted-foreground">
                    These documents are private and <strong>not shared</strong> with school, teachers, principal, or administration. Only you can see them.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.length === 0 ? (
                <Card className="col-span-full border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                      <FileText className="h-7 w-7 text-muted-foreground/50" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-muted-foreground">No documents found</p>
                    <p className="text-xs text-muted-foreground/70">Upload your first private document</p>
                  </CardContent>
                </Card>
              ) : (
                filteredDocs.map((doc) => {
                  const catCfg = CATEGORY_CONFIG[doc.category];
                  const FileIcon = getFileIcon(doc.fileType);
                  return (
                    <Card
                      key={doc.id}
                      className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50">
                            <FileIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedDoc(doc); setDetailOpen(true); }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Open with AI
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <h3 className="text-sm font-semibold leading-tight">{doc.name}</h3>
                          <p className="line-clamp-2 text-xs text-muted-foreground">{doc.description}</p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${catCfg.bg} ${catCfg.color} border-0`}>{catCfg.label}</Badge>
                          {doc.fileSize && <span className="text-xs text-muted-foreground">{doc.fileSize}</span>}
                        </div>
                        {doc.uploadDate && (
                          <p className="mt-2 text-xs text-muted-foreground/70">
                            Uploaded {new Date(doc.uploadDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-3 w-full text-xs text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                          Open with AI
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Document Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Document Details</SheetTitle>
            <SheetDescription>View and manage document information</SheetDescription>
          </SheetHeader>
          {selectedDoc && (
            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted/50">
                  {(() => { const Icon = getFileIcon(selectedDoc.fileType); return <Icon className="h-7 w-7 text-muted-foreground" />; })()}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">{selectedDoc.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDoc.description}</p>
                </div>
              </div>

              <Card className="border-border/50 bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    {(() => {
                      const cfg = STATUS_CONFIG[selectedDoc.status];
                      return (
                        <Badge variant="outline" className={`border ${cfg.border} ${cfg.bg} ${cfg.color}`}>
                          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </Badge>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  {(() => {
                    const cfg = CATEGORY_CONFIG[selectedDoc.category];
                    return <Badge variant="outline" className={`text-xs ${cfg.bg} ${cfg.color} border-0`}>{cfg.label}</Badge>;
                  })()}
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Name</span>
                  <span className="font-medium">{selectedDoc.fileName}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">File Size</span>
                  <span className="font-medium">{selectedDoc.fileSize}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Upload Date</span>
                  <span className="font-medium">
                    {selectedDoc.uploadDate
                      ? new Date(selectedDoc.uploadDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                      : "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verification Date</span>
                  <span className="font-medium">
                    {selectedDoc.verificationDate
                      ? new Date(selectedDoc.verificationDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                      : "—"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Verified By</span>
                  <span className="font-medium">{selectedDoc.verifiedBy ?? "—"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    {selectedDoc.isPrivate ? (
                      <>
                        <Lock className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Private — Only you</span>
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-blue-500">Shared with school</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download Document
                </Button>
                <Button variant="outline" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Replace Document
                </Button>
                {selectedDoc.isPrivate && (
                  <Button variant="ghost" className="w-full text-blue-500 hover:bg-blue-500/10 hover:text-blue-600">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Open with AI
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Upload Sheet */}
      <Sheet open={uploadOpen} onOpenChange={setUploadOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Upload Document</SheetTitle>
            <SheetDescription>Upload a new document to your collection</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Card className="border-2 border-dashed border-muted-foreground/20 bg-muted/20">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
                  <Upload className="h-7 w-7 text-muted-foreground/50" />
                </div>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                  Drag & drop or <span className="text-blue-500 cursor-pointer">browse files</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  PDF, JPG, PNG, DOCX up to 10MB
                </p>
              </CardContent>
            </Card>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700">
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

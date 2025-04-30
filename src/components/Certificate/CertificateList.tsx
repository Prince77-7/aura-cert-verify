
import React, { useState, useEffect } from "react";
import { Certificate } from "../../types/Certificate";
import CertificateCard from "./CertificateCard";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Calendar } from "lucide-react";

interface CertificateListProps {
  certificates: Certificate[];
  onRevoke?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  showFilters?: boolean;
}

export const CertificateList: React.FC<CertificateListProps> = ({
  certificates,
  onRevoke,
  onDelete,
  onEdit,
  showFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>(certificates);
  
  // Generate list of months
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];
  
  // Generate list of years (past 5 years and current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });
  
  // Filter certificates when search term or date filters change
  useEffect(() => {
    let filtered = [...certificates];
    
    // Filter by recipient name
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(cert => 
        cert.recipientName.toLowerCase().includes(lowercaseSearch) ||
        cert.title.toLowerCase().includes(lowercaseSearch) ||
        cert.certificationId.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Filter by issue date month and year
    if ((selectedMonth && selectedMonth !== 'all') || (selectedYear && selectedYear !== 'all')) {
      filtered = filtered.filter(cert => {
        if (!cert.issueDate) return false;
        
        const certDate = new Date(cert.issueDate);
        const certMonth = (certDate.getMonth() + 1).toString().padStart(2, "0");
        const certYear = certDate.getFullYear().toString();
        
        // Match both month and year if both are selected and not 'all'
        if (selectedMonth !== 'all' && selectedYear !== 'all') {
          return certMonth === selectedMonth && certYear === selectedYear;
        }
        // Match only month if only month is selected (and not 'all')
        else if (selectedMonth !== 'all' && (selectedYear === 'all' || !selectedYear)) {
          return certMonth === selectedMonth;
        }
        // Match only year if only year is selected (and not 'all')
        else if (selectedYear !== 'all' && (selectedMonth === 'all' || !selectedMonth)) {
          return certYear === selectedYear;
        }
        
        return true;
      });
    }
    
    setFilteredCertificates(filtered);
  }, [certificates, searchTerm, selectedMonth, selectedYear]);
  // Render filters UI
  const renderFilters = () => {
    if (!showFilters) return null;
    
    return (
      <div className="mb-6 p-4 border rounded-lg bg-background/50 backdrop-blur-sm">
        <h3 className="text-lg font-medium mb-4">Filter Certificates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search by name */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {/* Month filter */}
          <div className="space-y-2">
            <Label htmlFor="monthFilter">Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Year filter */}
          <div className="space-y-2">
            <Label htmlFor="yearFilter">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };

  if (certificates.length === 0) {
    return (
      <div>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-muted-foreground">No certificates found.</p>
        </div>
      </div>
    );
  }
  
  if (filteredCertificates.length === 0) {
    return (
      <div>
        {renderFilters()}
        <div className="text-center py-8">
          <p className="text-muted-foreground">No matching certificates found. Try adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderFilters()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCertificates.map((certificate) => (
          <CertificateCard
            key={certificate.id}
            certificate={certificate}
            showActions={!!onRevoke || !!onDelete || !!onEdit}
            onRevoke={onRevoke}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default CertificateList;

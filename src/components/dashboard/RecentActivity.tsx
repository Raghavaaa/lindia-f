"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Building2, 
  Bot,
  Clock,
  CheckCircle,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  {
    id: 1,
    type: "research",
    title: "Property Title Research",
    client: "ABC Law Associates",
    timestamp: "2 minutes ago",
    status: "completed",
    icon: Search
  },
  {
    id: 2,
    type: "case",
    title: "Case Law Analysis",
    client: "XYZ Legal Services",
    timestamp: "15 minutes ago",
    status: "completed",
    icon: FileText
  },
  {
    id: 3,
    type: "property",
    title: "Property Opinion Report",
    client: "DEF & Partners",
    timestamp: "1 hour ago",
    status: "completed",
    icon: Building2
  },
  {
    id: 4,
    type: "junior",
    title: "AI Legal Assistant Query",
    client: "GHI Law Firm",
    timestamp: "2 hours ago",
    status: "completed",
    icon: Bot
  },
  {
    id: 5,
    type: "research",
    title: "Contract Analysis",
    client: "JKL Associates",
    timestamp: "3 hours ago",
    status: "in_progress",
    icon: Search
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "research":
      return "text-blue-600";
    case "case":
      return "text-purple-600";
    case "property":
      return "text-green-600";
    case "junior":
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};

export default function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${getTypeColor(activity.type)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {activity.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(activity.status)}`}
                      >
                        {activity.status === "completed" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {activity.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.client}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <button className="text-sm text-primary hover:underline font-medium">
              View all activity →
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

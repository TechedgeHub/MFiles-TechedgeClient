/** @format */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleCheck,
  CircleChevronRight,
  FileText,
  Grid3x3,
  BarChart3,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Search,
  Mail,
  Phone,
  ChevronDown,
  ChevronRight,
  SquareChartGantt,
} from "lucide-react";
import { FaLocationArrow } from "react-icons/fa6";
import { RiFileList2Line } from "react-icons/ri";
import { NavLink } from "react-router-dom";

// Collapsible section component
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            {title}
          </CardTitle>
          {isOpen ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </div>
      </CardHeader>
      {isOpen && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
};

// Step guide component--borrow from homepage
const StepGuide = ({ icon: Icon, step, title, description, details }) => (
  <Card className="mb-6">
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center text-white font-bold">
          {step}
        </div>
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-primary" />
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="flex items-start gap-2">
            <CircleCheck className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
            <span className="text-sm">{detail}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// FAQ item component
const FAQItem = ({ question, answer }) => (
  <CollapsibleSection title={question}>
    <p className="text-gray-600">{answer}</p>
  </CollapsibleSection>
);

const Help = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
          <p className="text-xl text-blue-100">
            Everything you need to know about using M-Files Object Creator
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Getting Started */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
            <CircleChevronRight className="w-8 h-8" />
            Getting Started
          </h2>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-3">
                What is M-Files Object Creator?
              </h3>
              <p className="text-gray-600 mb-4">
                M-Files Object Creator is a simplified web interface that allows
                you to create and manage M-Files objects without the complexity
                of the full M-Files client. This tool connects directly to your
                Techedge Test Vault and provides an intuitive way to add
                students, cars, staff, and other objects.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">
                System Requirements
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Modern web browser (Chrome, Firefox, Safari, Edge)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Stable internet connection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  JavaScript enabled
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Step-by-Step Guide */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
            <SquareChartGantt className="w-8 h-8" />
            Step-by-Step Creation Guide
          </h2>

          <StepGuide
            icon={FileText}
            step="1"
            title="Select Type"
            description="Choose the type of object you want to create from pre-configured options."
            details={[
              "Student - For adding student records with admission details",
              "Car - For vehicle registration and management",
              "Staff - For employee records and information",
              "Each type has specific fields tailored to its purpose",
            ]}
          />

          <StepGuide
            icon={Grid3x3}
            step="2"
            title="Choose Class"
            description="Select the appropriate class for your object type."
            details={[
              "Classes define the specific properties and fields available",
              "Most object types have a default class (e.g., 'Student' class for Student objects)",
              "Choose from grouped or ungrouped classes as available",
              "The class determines what information you can store",
            ]}
          />

          <StepGuide
            icon={RiFileList2Line}
            step="3"
            title="Fill Form"
            description="Complete the dynamic form with your object's information."
            details={[
              "Required fields are marked with a red asterisk (*)",
              "Optional fields can be left empty if not needed",
              "Use the date picker for date fields",
              "Select from dropdown options for lookup fields",
              "Automatic fields are handled by the system",
            ]}
          />

          <StepGuide
            icon={FaLocationArrow}
            step="4"
            title="Submit"
            description="Review and submit your object for creation."
            details={[
              "Review all entered information before submitting",
              "Click 'Create Object' to process your submission",
              "Wait for confirmation message",
              "Your object will be created in the M-Files system",
            ]}
          />
        </section>

        {/* Field Types */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Understanding Field Types
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Text Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  For names, descriptions, and general text input.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Single line text (names, titles)</li>
                  <li>• Multi-line text (descriptions)</li>
                  <li>• Keep entries clear and concise</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Date Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">For dates and timestamps.</p>
                <ul className="space-y-1 text-sm">
                  <li>• Use the date picker widget</li>
                  <li>• Format: YYYY-MM-DD</li>
                  <li>• Required dates must be filled</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Lookup Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  For selecting from predefined options.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Single select (choose one option)</li>
                  <li>• Multi-select (choose multiple)</li>
                  <li>• Options load automatically</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Yes/No Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-3">
                  For boolean true/false selections.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Checkbox or toggle switch</li>
                  <li>• Check for "Yes" or "True"</li>
                  <li>• Leave unchecked for "No"</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Common Errors */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
            <AlertCircle className="w-8 h-8" />
            Common Error Messages
          </h2>

          <div className="space-y-4">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  "Missing required fields"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  <strong>Cause:</strong> One or more required fields (marked
                  with *) are empty.
                </p>
                <p className="text-gray-600">
                  <strong>Solution:</strong> Scroll through the form and fill
                  all fields marked with a red asterisk.
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="text-yellow-600 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  "Validation errors occurred"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  <strong>Cause:</strong> Data format is incorrect (wrong date
                  format, invalid numbers, etc.).
                </p>
                <p className="text-gray-600">
                  <strong>Solution:</strong> Check date formats, number fields,
                  and ensure all data is properly formatted.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  "Connection error"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">
                  <strong>Cause:</strong> Network issue or server unavailable.
                </p>
                <p className="text-gray-600">
                  <strong>Solution:</strong> Check your internet connection and
                  try again. If persistent, contact support.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
            <HelpCircle className="w-8 h-8" />
            Frequently Asked Questions
          </h2>

          <FAQItem
            question="Can I edit objects after creating them?"
            answer="Currently, this tool is designed for object creation only. To edit existing objects, you'll need to use the full M-Files client or contact your administrator."
          />

          <FAQItem
            question="Why don't I see all M-Files features here?"
            answer="This tool is intentionally simplified to focus on the most common object creation tasks. It provides an easier alternative to the complex M-Files client for basic operations."
          />

          <FAQItem
            question="How long does object creation take?"
            answer="Object creation is typically instantaneous. Once you click submit and see the success message, your object has been created in the M-Files system."
          />

          <FAQItem
            question="What happens if I refresh the page mid-creation?"
            answer="Refreshing the page will clear all entered data. Make sure to complete and submit your form before navigating away or refreshing."
          />

          <FAQItem
            question="Who can see the objects I create?"
            answer="Object visibility depends on your M-Files permissions and the vault's security settings. Contact your M-Files administrator for specific access information."
          />

          <FAQItem
            question="What if lookup fields are empty?"
            answer="If dropdown lists don't load or appear empty, this may indicate a connection issue or missing data in the system. Try refreshing the page or contact your administrator."
          />
        </section>

        {/* Tips for Success */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
            <CheckCircle className="w-8 h-8" />
            Tips for Success
          </h2>

          <Card>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CircleCheck className="w-4 h-4 text-green-500" />
                    Before You Start
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Gather all necessary information first</li>
                    <li>• Have dates and numbers ready in correct format</li>
                    <li>• Know which lookup options to select</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CircleCheck className="w-4 h-4 text-green-500" />
                    While Creating
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Fill required fields (marked with *) first</li>
                    <li>• Use descriptive names and titles</li>
                    <li>• Double-check dates and numbers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Support */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
            <Users className="w-8 h-8" />
            Getting More Help
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  For technical issues with this tool or M-Files system
                  problems.
                </p>
                <Button asChild className="w-full">
                  <a href="mailto:support@techedgeafrica.com">Email Support</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  M-Files Administrator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  For questions about permissions, new object types, or M-Files
                  configuration.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:admin@techedgeafrica.com">Contact Admin</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Quick Start */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Now that you know how to use M-Files Object Creator, start creating
            your first object!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <NavLink to="/create">Start Creating Objects</NavLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <NavLink to="/">Back to Homepage</NavLink>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Help;

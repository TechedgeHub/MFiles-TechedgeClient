/** @format */

import { FileText, Grid3X3 } from "lucide-react";
import { FaLocationArrow } from "react-icons/fa6";
import { RiFileList2Line } from "react-icons/ri";

export const stepGuidedData = [
  {
    icon: FileText,
    step: "1",
    title: "Selecty Type",
    description:
      "choose the type of object you want to create from pre-configured options.",
    details: [
      "student: for creating new student record admission",
      "Car: register vehicle management",
      "Staff: Create new employee records",
      "Each type has a different set of MetaData",
    ],
  },
  {
    icon: Grid3X3,
    step: "2",
    title: "Choose Class",
    description: "Select a class from the drop down",
    details: [
      "Classes define the specific properties and fields available",
      "Most object types have a default class (e.g., 'Student' class for Student objects)",
      "The class determines what information you can store",
    ],
  },
  {
    icon: RiFileList2Line,
    step: "3",
    title: "Fill MD form",
    description:
      "Complete form detail with objects you wish to add to the vault",
    details: [
      "Required fields are marked with a red asterisk (*)",
      "Optional fields can be left empty if not needed",
      "Select from dropdown options for lookup fields",
      "Automatic fields are handled by the system",
    ],
  },
  {
    icon: FaLocationArrow,
    step: "4",
    title: "Submit",
    description: "Submit object to the vault",
    details: [
      "Review all entered information before submitting",
      "Click 'Create Object' to process your submission",
      "Wait for confirmation message",
      "Your object will be created in the M-Files system",
    ],
  },
];

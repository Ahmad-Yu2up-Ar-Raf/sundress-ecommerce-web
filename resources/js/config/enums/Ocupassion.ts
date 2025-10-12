import { OptionItem } from "@/types";
import { GraduationCap, Briefcase } from "lucide-react";

export interface GroupedOptions {
  [key: string]: OptionItem[];
}

export const UserOccupation: OptionItem[] = [
  { 
    value: "student", 
    label: "Student", 
    icon: GraduationCap, 
    subLabel: "Pelajar / Mahasiswa", 
    description: "Masih menempuh pendidikan di sekolah atau universitas." 
  },
  { 
    value: "worker", 
    label: "Worker", 
    icon: Briefcase, 
    subLabel: "Pekerja / Profesional", 
    description: "Sudah bekerja secara aktif di suatu bidang atau perusahaan." 
  },
];

export const UserOccupationValue: string[] = UserOccupation.map((item) => item.value);

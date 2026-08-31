import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/common/Table';
import { Avatar } from '../components/common/Avatar';
import { StatusBadge } from '../components/common/Badge';
import { mockStudents } from '../data/mockClasses';
import { Users } from 'lucide-react';

export const TeacherStudentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Users className="w-7 h-7 text-indigo-400" />
          Enrolled Students Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">View overall student performance, activity streaks, and quiz averages.</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Words Learned</TableHead>
            <TableHead>Quiz Average</TableHead>
            <TableHead>Streak</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={student.avatar} name={student.name} size="sm" />
                  <div>
                    <p className="font-bold text-white text-xs">{student.name}</p>
                    <p className="text-[10px] text-slate-400">{student.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-bold text-slate-200">{student.wordsLearned}</TableCell>
              <TableCell className="font-bold text-emerald-400">{student.quizAverage}%</TableCell>
              <TableCell>{student.streak} days 🔥</TableCell>
              <TableCell className="text-xs text-slate-400">{student.lastActive}</TableCell>
              <TableCell>
                <StatusBadge status={student.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

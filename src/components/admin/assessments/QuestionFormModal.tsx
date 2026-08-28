import React, { useState, useEffect } from 'react';
import { BankQuestion, QuestionType, SkillCategory, DifficultyLevel, CodingTestCase } from '../../../types';
import { X, Plus, Trash2, Sparkles, CheckCircle2, AlertTriangle, Code2, BookOpen, CheckSquare } from 'lucide-react';

interface QuestionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: Omit<BankQuestion, 'id' | 'aiStatus'>) => void;
  initialQuestion?: BankQuestion | null;
}

const AVAILABLE_SKILLS: SkillCategory[] = [
  'Python',
  'Java',
  'JavaScript',
  'React',
  'DSA',
  'SQL',
  'DBMS',
  'Aptitude',
  'Communication',
  'HTML/CSS',
];

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialQuestion,
}) => {
  const [type, setType] = useState<QuestionType>('MCQ');
  const [skill, setSkill] = useState<SkillCategory>('Python');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [marks, setMarks] = useState<number>(5);

  // MCQ Specific
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  // Coding Specific
  const [problemStatement, setProblemStatement] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [expectedSolution, setExpectedSolution] = useState('');
  const [testCases, setTestCases] = useState<CodingTestCase[]>([
    { input: '', expectedOutput: '', isHidden: false },
    { input: '', expectedOutput: '', isHidden: true },
  ]);

  // Descriptive Specific
  const [descriptiveQuestion, setDescriptiveQuestion] = useState('');
  const [expectedAnswer, setExpectedAnswer] = useState('');
  const [evaluationCriteria, setEvaluationCriteria] = useState('');

  useEffect(() => {
    if (initialQuestion) {
      setType(initialQuestion.type);
      setSkill(initialQuestion.skill);
      setDifficulty(initialQuestion.difficulty);
      setMarks(initialQuestion.marks);

      if (initialQuestion.type === 'MCQ') {
        setQuestionText(initialQuestion.question || '');
        setOptionA(initialQuestion.optionA || '');
        setOptionB(initialQuestion.optionB || '');
        setOptionC(initialQuestion.optionC || '');
        setOptionD(initialQuestion.optionD || '');
        setCorrectAnswer((initialQuestion.correctAnswer as 'A' | 'B' | 'C' | 'D') || 'A');
        setExplanation(initialQuestion.explanation || '');
      } else if (initialQuestion.type === 'Coding') {
        setProblemStatement(initialQuestion.problemStatement || '');
        setInputFormat(initialQuestion.inputFormat || '');
        setOutputFormat(initialQuestion.outputFormat || '');
        setConstraints(initialQuestion.constraints || '');
        setSampleInput(initialQuestion.sampleInput || '');
        setSampleOutput(initialQuestion.sampleOutput || '');
        setExpectedSolution(initialQuestion.expectedSolution || '');
        setTestCases(
          initialQuestion.testCases && initialQuestion.testCases.length > 0
            ? initialQuestion.testCases
            : [{ input: '', expectedOutput: '', isHidden: false }]
        );
      } else {
        setDescriptiveQuestion(initialQuestion.question || '');
        setExpectedAnswer(initialQuestion.expectedAnswer || '');
        setEvaluationCriteria(initialQuestion.evaluationCriteria || '');
      }
    } else {
      // Default reset
      setType('MCQ');
      setSkill('Python');
      setDifficulty('Medium');
      setMarks(5);
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectAnswer('A');
      setExplanation('');
      setProblemStatement('');
      setInputFormat('');
      setOutputFormat('');
      setConstraints('');
      setSampleInput('');
      setSampleOutput('');
      setExpectedSolution('');
      setTestCases([
        { input: '', expectedOutput: '', isHidden: false },
        { input: '', expectedOutput: '', isHidden: true },
      ]);
      setDescriptiveQuestion('');
      setExpectedAnswer('');
      setEvaluationCriteria('');
    }
  }, [initialQuestion, isOpen]);

  if (!isOpen) return null;

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index: number, field: keyof CodingTestCase, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'MCQ') {
      onSave({
        type: 'MCQ',
        skill,
        difficulty,
        marks: Number(marks) || 5,
        question: questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
      });
    } else if (type === 'Coding') {
      onSave({
        type: 'Coding',
        skill,
        difficulty,
        marks: Number(marks) || 10,
        problemStatement,
        inputFormat,
        outputFormat,
        constraints,
        sampleInput,
        sampleOutput,
        expectedSolution,
        testCases: testCases.filter((tc) => tc.input.trim() || tc.expectedOutput.trim()),
      });
    } else {
      onSave({
        type: 'Descriptive',
        skill,
        difficulty,
        marks: Number(marks) || 8,
        question: descriptiveQuestion,
        expectedAnswer,
        evaluationCriteria,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#4F46E5]">
              {type === 'MCQ' ? (
                <CheckSquare className="w-4 h-4" />
              ) : type === 'Coding' ? (
                <Code2 className="w-4 h-4" />
              ) : (
                <BookOpen className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {initialQuestion ? 'Edit Question' : 'Author New Question'}
              </h3>
              <p className="text-xs text-slate-500">
                Define question specifications, grading schema, and test criteria.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Question Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Question Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['MCQ', 'Coding', 'Descriptive'] as QuestionType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setType(t);
                    if (t === 'MCQ') setMarks(5);
                    else if (t === 'Coding') setMarks(10);
                    else setMarks(8);
                  }}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    type === t
                      ? 'border-[#4F46E5] bg-indigo-50/70 text-[#4F46E5] shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t === 'MCQ' && <CheckSquare className="w-3.5 h-3.5" />}
                  {t === 'Coding' && <Code2 className="w-3.5 h-3.5" />}
                  {t === 'Descriptive' && <BookOpen className="w-3.5 h-3.5" />}
                  <span>{t} Question</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skill, Difficulty & Marks */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Skill
              </label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value as SkillCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {AVAILABLE_SKILLS.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Marks Awarded
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>

          {/* MCQ FIELDS */}
          {type === 'MCQ' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question Text / Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="e.g. What is the output of the following Python list comprehension?"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">
                  Multiple Choice Options <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      A
                    </span>
                    <input
                      type="text"
                      value={optionA}
                      onChange={(e) => setOptionA(e.target.value)}
                      placeholder="Option A text"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      B
                    </span>
                    <input
                      type="text"
                      value={optionB}
                      onChange={(e) => setOptionB(e.target.value)}
                      placeholder="Option B text"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      C
                    </span>
                    <input
                      type="text"
                      value={optionC}
                      onChange={(e) => setOptionC(e.target.value)}
                      placeholder="Option C text"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      D
                    </span>
                    <input
                      type="text"
                      value={optionD}
                      onChange={(e) => setOptionD(e.target.value)}
                      placeholder="Option D text"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Correct Option <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value as 'A' | 'B' | 'C' | 'D')}
                    className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 focus:bg-white focus:outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Explanation / Solution Key
                  </label>
                  <input
                    type="text"
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Short conceptual explanation..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CODING FIELDS */}
          {type === 'Coding' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Problem Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe the algorithmic challenge clearly..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Input Format</label>
                  <input
                    type="text"
                    value={inputFormat}
                    onChange={(e) => setInputFormat(e.target.value)}
                    placeholder="e.g. Array nums, integer target"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Output Format</label>
                  <input
                    type="text"
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    placeholder="e.g. Array of two indices"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Constraints</label>
                  <input
                    type="text"
                    value={constraints}
                    onChange={(e) => setConstraints(e.target.value)}
                    placeholder="e.g. 2 <= nums.length <= 10^4"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sample Input</label>
                  <textarea
                    rows={2}
                    value={sampleInput}
                    onChange={(e) => setSampleInput(e.target.value)}
                    placeholder="[2, 7, 11, 15], target = 9"
                    className="w-full p-2 bg-slate-50 font-mono text-[11px] border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sample Output</label>
                  <textarea
                    rows={2}
                    value={sampleOutput}
                    onChange={(e) => setSampleOutput(e.target.value)}
                    placeholder="[0, 1]"
                    className="w-full p-2 bg-slate-50 font-mono text-[11px] border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Expected Reference Solution / Boilerplate
                </label>
                <textarea
                  rows={4}
                  value={expectedSolution}
                  onChange={(e) => setExpectedSolution(e.target.value)}
                  placeholder={`def solve(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        ...`}
                  className="w-full p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none"
                />
              </div>

              {/* Test Cases */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Automated Test Cases</label>
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Test Case
                  </button>
                </div>

                {testCases.map((tc, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                    <span className="text-[11px] font-bold text-slate-500 shrink-0">#{idx + 1}</span>
                    <input
                      type="text"
                      value={tc.input}
                      onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                      placeholder="Input params"
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={tc.expectedOutput}
                      onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                      placeholder="Expected output"
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                    />
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={tc.isHidden}
                        onChange={(e) => handleTestCaseChange(idx, 'isHidden', e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-0"
                      />
                      Hidden
                    </label>
                    {testCases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestCase(idx)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTIVE FIELDS */}
          {type === 'Descriptive' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={descriptiveQuestion}
                  onChange={(e) => setDescriptiveQuestion(e.target.value)}
                  placeholder="e.g. Explain the difference between optimistic and pessimistic concurrency control in database transactions."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Expected Concepts & Key Points <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={expectedAnswer}
                  onChange={(e) => setExpectedAnswer(e.target.value)}
                  placeholder="List the key concepts that must be present in candidate's response..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Evaluation Rubric & Grading Criteria
                </label>
                <input
                  type="text"
                  value={evaluationCriteria}
                  onChange={(e) => setEvaluationCriteria(e.target.value)}
                  placeholder="e.g. 4 marks for definition, 2 marks for real-world locking tradeoffs, 2 marks for diagrams/examples."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              {initialQuestion ? 'Save Updates' : 'Add to Question Bank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

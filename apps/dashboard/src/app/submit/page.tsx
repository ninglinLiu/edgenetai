'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { useEdgeApi } from '@/lib/edge-api/EdgeApiProvider';
import { TaskType, SLATier } from '@/lib/edge-api/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, ChevronRight, ChevronLeft, Check } from 'lucide-react';

const SLA_CONFIG = {
  BRONZE: { nodes: '2/3', cost: 0.01, latency: '500-800ms', disputeProb: 15 },
  SILVER: { nodes: '3/5', cost: 0.02, latency: '300-500ms', disputeProb: 10 },
  GOLD: { nodes: '5/7', cost: 0.05, latency: '200-300ms', disputeProb: 5 },
};

export default function SubmitPage() {
  const router = useRouter();
  const api = useEdgeApi();
  const [step, setStep] = useState(1);
  const [taskType, setTaskType] = useState<TaskType>(TaskType.LLM_SUMMARY);
  const [payload, setPayload] = useState('');
  const [slaTier, setSlaTier] = useState<SLATier>(SLATier.SILVER);
  const [loading, setLoading] = useState(false);

  const estimates = useMemo(() => {
    const config = SLA_CONFIG[slaTier];
    return {
      cost: config.cost,
      latency: config.latency,
      nodes: config.nodes,
      disputeProb: config.disputeProb,
    };
  }, [slaTier]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await api.createTask({ type: taskType, payload, slaTier });
      router.push(`/tasks/${result.taskId}`);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Submit Inference Task</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s < step
                    ? 'bg-green-500 text-white'
                    : s === step
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? 'bg-green-500' : 'bg-slate-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Type & Input */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Task Type & Input</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Select Task Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTaskType(TaskType.LLM_SUMMARY)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        taskType === TaskType.LLM_SUMMARY
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <FileText className="w-8 h-8 mb-2 text-blue-400" />
                      <div className="font-semibold">LLM Summary</div>
                      <div className="text-sm text-slate-400">Text summarization</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTaskType(TaskType.OCR_IMAGE)}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        taskType === TaskType.OCR_IMAGE
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <Image className="w-8 h-8 mb-2 text-purple-400" />
                      <div className="font-semibold">OCR Image</div>
                      <div className="text-sm text-slate-400">Image text extraction</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    {taskType === TaskType.LLM_SUMMARY ? 'Text to Summarize' : 'Image (Base64)'}
                  </label>
                  <textarea
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={8}
                    placeholder={
                      taskType === TaskType.LLM_SUMMARY
                        ? 'Enter text to summarize...'
                        : 'Paste base64 encoded image...'
                    }
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)} disabled={!payload}>
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: SLA & Parameters */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">SLA & Parameters</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    SLA Tier
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(SLA_CONFIG).map(([tier, config]) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setSlaTier(tier as SLATier)}
                        className={`p-6 rounded-lg border-2 transition-all text-left ${
                          slaTier === tier
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-2">{tier}</div>
                        <div className="text-sm text-slate-400 space-y-1">
                          <div>Nodes: {config.nodes}</div>
                          <div>Cost: ~{config.cost} ETH</div>
                          <div>Latency: {config.latency}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Estimated Parameters</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Estimated Cost</div>
                      <div className="text-xl font-semibold text-white">{estimates.cost} ETH</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Estimated Latency</div>
                      <div className="text-xl font-semibold text-white">{estimates.latency}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Redundant Nodes</div>
                      <div className="text-xl font-semibold text-white">{estimates.nodes}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Dispute Probability</div>
                      <div className="text-xl font-semibold text-white">{estimates.disputeProb}%</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm & Submit */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Confirm & Submit</h2>
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
                  <div>
                    <div className="text-slate-400 text-sm">Task Type</div>
                    <div className="text-lg font-semibold text-white">{taskType}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">SLA Tier</div>
                    <div className="text-lg font-semibold text-white">{slaTier}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Payload Preview</div>
                    <div className="text-sm text-slate-300 font-mono bg-slate-900 p-3 rounded mt-2 break-all">
                      {payload.slice(0, 100)}...
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-slate-400 text-sm">Estimated Cost</div>
                      <div className="text-lg font-semibold text-white">{estimates.cost} ETH</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm">Estimated Latency</div>
                      <div className="text-lg font-semibold text-white">{estimates.latency}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {loading ? 'Submitting...' : 'Submit Task'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Shell>
  );
}


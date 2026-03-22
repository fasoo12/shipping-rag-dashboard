"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DatePicker } from "@/components/ui/datepicker";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportParams {
  question: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  minSimilarity: number;
  maxArticles: number;
}

export function ResearchDashboard() {
  const [params, setParams] = useState<ReportParams>({
    question: "",
    startDate: undefined,
    endDate: undefined,
    minSimilarity: 0.2,
    maxArticles: 15,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isHtml, setIsHtml] = useState(false);

  const handleGenerateReport = async () => {
    // Validation
    if (!params.question.trim()) {
      setError("질문을 입력해주세요.");
      return;
    }

    if (!params.startDate || !params.endDate) {
      setError("시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const payload = {
        question: params.question,
        startDate: params.startDate?.toISOString().split("T")[0],
        endDate: params.endDate?.toISOString().split("T")[0],
        minSimilarity: params.minSimilarity,
        maxArticles: params.maxArticles,
      };

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const reportText = data.report || "결과를 가져올 수 없습니다.";
      setResult(reportText);
      // HTML 태그가 포함되어 있으면 HTML 모드 활성화
      setIsHtml(/<[^>]*>/g.test(reportText));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🚢 해운/물류 AI 리서치 대시보드
          </h1>
          <p className="text-slate-600">
            AI 기반 분석으로 해운 및 물류 시장 인사이트를 얻으세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Search Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>검색 조건</CardTitle>
                <CardDescription>
                  분석할 범위와 조건을 설정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Input */}
                <div className="space-y-2">
                  <Label htmlFor="question">질문</Label>
                  <Input
                    id="question"
                    placeholder="예: 한국 해운사의 최근 동향은?"
                    value={params.question}
                    onChange={(e) =>
                      setParams({ ...params, question: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label htmlFor="start-date">시작일</Label>
                  <DatePicker
                    value={params.startDate}
                    onChange={(date) =>
                      setParams({ ...params, startDate: date })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-date">종료일</Label>
                  <DatePicker
                    value={params.endDate}
                    onChange={(date) =>
                      setParams({ ...params, endDate: date })
                    }
                  />
                </div>

                {/* Similarity Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>최소 유사도</Label>
                    <span className="text-sm font-semibold text-blue-600">
                      {params.minSimilarity.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={params.minSimilarity}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        minSimilarity: parseFloat(e.currentTarget.value),
                      })
                    }
                    disabled={loading}
                  />
                  <p className="text-xs text-slate-500">
                    0.0 (낮음) ~ 1.0 (높음)
                  </p>
                </div>

                {/* Max Articles */}
                <div className="space-y-2">
                  <Label htmlFor="max-articles">최대 기사 수량</Label>
                  <Input
                    id="max-articles"
                    type="number"
                    min="1"
                    max="100"
                    value={params.maxArticles}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        maxArticles: Math.max(1, parseInt(e.target.value) || 15),
                      })
                    }
                    disabled={loading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-md bg-red-50 border border-red-200">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-full h-11 text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    "📊 리포트 생성하기"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            {result ? (
              <Card className="h-full">
                <CardHeader className="border-b">
                  <CardTitle>분석 결과</CardTitle>
                  <CardDescription>
                    AI 생성 리포트 (마크다운 형식)
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 overflow-y-auto max-h-96 md:max-h-full">
                  {isHtml ? (
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: result }}
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result}
                      </ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center min-h-96 bg-slate-50">
                <div className="text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-slate-500 text-lg">
                    좌측 패널에서 검색 조건을 설정하고
                  </p>
                  <p className="text-slate-500">
                    "리포트 생성하기" 버튼을 클릭하세요
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

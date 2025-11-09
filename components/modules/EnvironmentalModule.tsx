import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, Sector } from 'recharts';
import { MetricCard } from '../common/MetricCard';
import { SparklesIcon } from '../icons/SparklesIcon';
import { useDataContext } from '../contexts/DataContext';
import { Card } from '../common/Card';

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={'var(--color-text-accent)'} className="text-lg font-bold font-mono">
        {payload.name}
      </text>
       <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={'var(--color-green-muted)'} className="text-sm font-mono">
        ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const COLORS = ['var(--color-data-blue)', 'var(--color-green-primary)', '#3b82f6', '#f59e0b']; // blue, green, blue, amber

const EnvironmentalModule: React.FC = () => {
    const { database } = useDataContext();
    const data = database.environmental;
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const materialData = data.materialComposition;

    const onPieClick = (_: any, index: number) => {
        setActiveIndex(index);
    };

    const activeMaterial = activeIndex !== null ? materialData[activeIndex] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeIn">
        <div className="lg:col-span-3 space-y-6">
            <Card title="AI-Powered Material Identification">
                 <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                activeIndex={activeIndex ?? undefined}
                                activeShape={renderActiveShape}
                                data={materialData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                onClick={onPieClick}
                                className="cursor-pointer"
                            >
                                {materialData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none" />
                                ))}
                            </Pie>
                             <Legend onClick={(d) => onPieClick(null, materialData.findIndex(m => m.name === d.value))} wrapperStyle={{cursor: 'pointer', fontSize: '12px', color: 'var(--color-text-primary)'}} />
                             <RechartsTooltip
                              contentStyle={{
                                backgroundColor: 'var(--color-bg-primary)',
                                borderColor: 'var(--color-green-dark)',
                              }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            {activeMaterial && (
                <div className="bg-bg-secondary p-6 rounded-sm border border-data-blue/50 animate-fadeInUp">
                    <h3 className="text-lg font-semibold text-data-blue mb-2 font-mono">Material Details: {activeMaterial.name}</h3>
                    <p className="text-sm text-text-primary mb-4">{activeMaterial.description}</p>
                    <div className="space-y-3 text-sm border-t border-green-dark pt-4">
                        <h4 className="text-md font-semibold text-text-accent">Key Properties</h4>
                        {Object.keys(activeMaterial.properties).map((key) => (
                            <p key={key} className="flex justify-between">
                                <span className="capitalize text-green-muted">{key}</span>
                                <span className="font-mono text-data-blue">{activeMaterial.properties[key]}</span>
                            </p>
                        ))}
                    </div>
                    <div className="text-sm border-t border-green-dark pt-4 mt-4">
                        <h4 className="text-md font-semibold text-text-accent">Common Uses</h4>
                        <p className="text-text-primary mt-2">{activeMaterial.common_uses}</p>
                    </div>
                </div>
            )}
        </div>
        <div className="lg:col-span-2 space-y-8">
             <Card title="Environmental Scan">
                <div className="grid grid-cols-2 gap-4">
                    {data.scanMetrics.map(stat => <MetricCard key={stat.label} {...stat} />)}
                </div>
            </Card>
             <Card title="Air Quality Estimation">
                 <div className="grid grid-cols-1 gap-4">
                    {data.airQuality.map(stat => <MetricCard key={stat.label} {...stat} />)}
                </div>
            </Card>
             <Card>
                <h3 className="text-lg font-semibold text-text-accent mb-4 flex items-center font-mono">
                    <SparklesIcon className="h-5 w-5 mr-2 text-data-blue"/>AI Anomaly Insights
                </h3>
                <p className="text-sm text-text-primary mb-4">{data.explainability.summary}</p>
                <div className="space-y-3 text-sm border-t border-green-dark pt-4">
                    <h4 className="text-md font-semibold text-text-accent">Feature Attribution</h4>
                    {data.explainability.featureAttributions.map(attr => (
                        <div key={attr.feature}>
                            <div className="flex justify-between mb-1">
                                <span className="text-green-muted">{attr.feature}</span>
                                <span className="font-mono text-data-blue">{attr.contribution}%</span>
                            </div>
                            <div className="w-full bg-green-dark rounded-full h-2">
                                <div className="bg-data-blue h-2 rounded-full" style={{ width: `${attr.contribution}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-xs text-green-muted/80 bg-bg-primary/50 p-3 rounded-sm">
                    <p className="font-bold mb-1 text-green-muted">Scientific Assumptions:</p>
                    <p>{data.assumptions}</p>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default EnvironmentalModule;
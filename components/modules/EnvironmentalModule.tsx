import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, Sector } from 'recharts';
import { MetricCard } from '../common/MetricCard';
import Tooltip from '../common/Tooltip';
import { SparklesIcon } from '../icons/SparklesIcon';
import { useDataContext } from '../contexts/DataContext';

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-lg font-bold">
        {payload.name}
      </text>
       <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#9ca3af" className="text-sm">
        ({(props.percent * 100).toFixed(0)}%)
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

const COLORS = ['#06b6d4', '#22c55e', '#3b82f6', '#f59e0b']; // cyan, green, blue, amber

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
        <div className="lg:col-span-3 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">AI-Powered Material Identification</h2>
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
                         <Legend onClick={(d) => onPieClick(null, materialData.findIndex(m => m.name === d.value))} wrapperStyle={{cursor: 'pointer'}} />
                         <RechartsTooltip
                          contentStyle={{
                            backgroundColor: '#1f2937', // bg-gray-800
                            borderColor: '#374151', // border-gray-700
                          }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            {activeMaterial && (
                <div className="bg-gray-700/50 p-6 rounded-lg border border-cyan-500/30 animate-fadeInUp">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">Material Details: {activeMaterial.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{activeMaterial.description}</p>
                    <div className="space-y-3 text-sm border-t border-gray-600 pt-4">
                        <h4 className="text-md font-semibold text-gray-300">Key Properties</h4>
                        {// FIX: Use Object.keys for safer type inference. The value from Object.entries was inferred as 'unknown', which is not a valid ReactNode.
                        Object.keys(activeMaterial.properties).map((key) => (
                            <p key={key} className="flex justify-between">
                                <span className="capitalize text-gray-400">{key}</span>
                                <span className="font-mono text-cyan-300">{activeMaterial.properties[key]}</span>
                            </p>
                        ))}
                    </div>
                    <div className="text-sm border-t border-gray-600 pt-4 mt-4">
                        <h4 className="text-md font-semibold text-gray-300">Common Uses</h4>
                        <p className="text-gray-400 mt-2">{activeMaterial.common_uses}</p>
                    </div>
                </div>
            )}
        </div>
        <div className="lg:col-span-2 space-y-8">
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h2 className="text-lg font-semibold text-gray-300 mb-4">Environmental Scan</h2>
                <div className="grid grid-cols-2 gap-4">
                    {data.scanMetrics.map(stat => <MetricCard key={stat.label} {...stat} />)}
                </div>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h2 className="text-lg font-semibold text-gray-300 mb-4">Air Quality Estimation</h2>
                 <div className="grid grid-cols-1 gap-4">
                    {data.airQuality.map(stat => <MetricCard key={stat.label} {...stat} />)}
                </div>
            </div>
             <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 animate-fadeInUp">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center"><SparklesIcon className="h-5 w-5 mr-2 text-cyan-400"/>AI Anomaly Detection Insights</h3>
                <p className="text-sm text-gray-400 mb-4">{data.explainability.summary}</p>
                <div className="space-y-3 text-sm border-t border-gray-600 pt-4">
                    <h4 className="text-md font-semibold text-gray-300">Feature Attribution</h4>
                    {data.explainability.featureAttributions.map(attr => (
                        <div key={attr.feature}>
                            <div className="flex justify-between mb-1">
                                <span className="text-gray-400">{attr.feature}</span>
                                <span className="font-mono text-cyan-300">{attr.contribution}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${attr.contribution}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-xs text-gray-500 bg-black/20 p-3 rounded-lg">
                    <p className="font-bold mb-1">Scientific Assumptions:</p>
                    <p>{data.assumptions}</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EnvironmentalModule;

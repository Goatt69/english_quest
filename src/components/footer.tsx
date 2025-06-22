"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5 }
    }
};

export default function Footer() {
    return (
        <motion.footer
            className="bg-gray-900 text-white py-12 px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, margin: "-100px"}}
            variants={containerVariants}
        >
            <div className="container mx-auto">
                <motion.div
                    className="grid md:grid-cols-4 gap-8"
                    variants={containerVariants}
                >
                    <motion.div variants={itemVariants}>
                        <motion.div
                            className="flex items-center space-x-2 mb-4"
                            whileHover={{scale: 1.02}}
                        >
                            <motion.div
                                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center"
                                whileHover={{rotate: 360}}
                                transition={{duration: 0.6}}
                            >
                                <BookOpen className="h-5 w-5 text-white"/>
                            </motion.div>
                            <span className="text-xl font-bold">English Quest</span>
                        </motion.div>
                        <p className="text-gray-400">Making English learning accessible and fun for everyone.</p>
                    </motion.div>

                    {[
                        {
                            title: "Product",
                            links: [
                                {href: "/features", label: "Features"},
                                {href: "/pricing", label: "Pricing"},
                                {href: "/dashboard", label: "Dashboard"}
                            ]
                        },
                        {
                            title: "Support",
                            links: [
                                {href: "/help", label: "Help Center"},
                                {href: "/contact", label: "Contact"},
                                {href: "/leaderboard", label: "Community"}
                            ]
                        },
                        {
                            title: "Company",
                            links: [
                                {href: "/about", label: "About"},
                                {href: "/careers", label: "Careers"},
                                {href: "/privacy", label: "Privacy"}
                            ]
                        }
                    ].map((section, sectionIndex) => (
                        <motion.div key={section.title} variants={itemVariants}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2 text-gray-400">
                                {section.links.map((link, linkIndex) => (
                                    <motion.li
                                        key={link.href}
                                        initial={{x: -10, opacity: 0}}
                                        whileInView={{x: 0, opacity: 1}}
                                        transition={{
                                            duration: 0.3,
                                            delay: sectionIndex * 0.1 + linkIndex * 0.05
                                        }}
                                        viewport={{once: true}}
                                    >
                                        <Link
                                            href={link.href}
                                            className="hover:text-white transition-colors relative group"
                                        >
                                            {link.label}
                                            <motion.div
                                                className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 group-hover:w-full transition-all duration-300"
                                            />
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
                    initial={{opacity: 0}}
                    whileInView={{opacity: 1}}
                    transition={{duration: 0.6, delay: 0.8}}
                    viewport={{once: true}}
                >
                    <p>&copy; 2025 English Quest. All rights reserved.</p>
                </motion.div>
            </div>
        </motion.footer>
    );
}